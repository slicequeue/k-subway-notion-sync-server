const express = require('express');
const { query, param, validationResult } = require('express-validator');

const metroService = require('../../vendors/gov/metro/service');
const { DailyTypeCode, UpDownTypeCode } = require('../../vendors/gov/metro/types/codes');
const { getCodeKeys } = require('../../vendors/gov/metro/types/utils');
const router = express.Router();

router.get('', [query('nameKeyWord').isString().isLength(1)], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const results = (await metroService.getSubwayList(req.query.nameKeyWord))
  return res.json(results);
});

router.get('/:stationId/all', [
  query('pageNo').optional().isInt().default(1),
  query('numOfRows').optional().isInt().default(400),
  query('filterNonArrive').optional().isBoolean().default(true),
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
    pageNo,
    numOfRows,
    filterNonArrive,
  } = req.query;

  return res.json(
    results = await metroService.getStationAllArgsTimetable(
      stationId, 
      parseInt(pageNo), 
      parseInt(numOfRows), 
      Boolean(filterNonArrive)
  ));
});

router.get('/:stationId', [

  query('dailyTypeCode').isString().isIn(getCodeKeys(DailyTypeCode)),
  query('upDownTypeCode').isString().isIn(getCodeKeys(UpDownTypeCode)),
  query('pageNo').optional().isInt().default(1),
  query('numOfRows').optional().isInt().default(400),
  query('filterNonArrive').optional().isBoolean().default(true),

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

  return res.json(
    await metroService.getStationTimetable(
      stationId, 
      DailyTypeCode[dailyTypeCodeKey], 
      UpDownTypeCode[upDownTypeCodeKey], 
      parseInt(pageNo), 
      parseInt(numOfRows), 
      Boolean(filterNonArrive)
    )
  );

});



module.exports = router
