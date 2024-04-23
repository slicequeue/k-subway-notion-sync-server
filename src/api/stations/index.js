const express = require('express');
const { query, param, validationResult } = require('express-validator');

const metroApi = require('../../gov/metro');
const { DailyTypeCode, UpDownTypeCode } = metroApi.codes;
const router = express.Router();

router.get('', [query('nameKeyWord').isString().isLength(1)], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const results = (await metroApi.getSubwayList(req.query.nameKeyWord))
  return res.json(results);
});

router.get('/:stationId', [

  query('dailyTypeCode').isString().isIn(Object.keys(DailyTypeCode)),
  query('upDownTypeCode').isString().isIn(UpDownTypeCode),
  query('pageNo').optional().isInt(),
  query('numOfRows').optional().isInt(),
  query('filterNonArrive').optional().isBoolean(),

  param('stationId').isString(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    stationId
  } = req.params;

  const {
    dailyTypeCode: dailyTypeCodeKey,
    upDownTypeCode: upDownTypeCodeKey,
    pageNo,
    numOfRows,
    filterNonArrive,
  } = req.query;

  const results = await metroApi.getStationTimetable(
    stationId, 
    DailyTypeCode[dailyTypeCodeKey], 
    UpDownTypeCode[upDownTypeCodeKey], 
    parseInt(pageNo), 
    parseInt(numOfRows), 
    Boolean(filterNonArrive)
  );
  return res.json(results);
});



module.exports = router
