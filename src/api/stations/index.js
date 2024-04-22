const express = require('express');
const metroApi = require('../../gov/metro');
const { query, validationResult } = require('express-validator');
const SearchSubwayStationResponse = require('../../dto/SearchSubwayStationResponse');
const router = express.Router();

router.get('', [query('nameKeyWord').isString().isLength(1)], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const results = (await metroApi.getSubwayList(req.query.nameKeyWord))
    .map(each => new SearchSubwayStationResponse(each));
  return res.json(results);
});

module.exports = router
