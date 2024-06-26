const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');

const logger = require('../../common/utils/logger');
const SubwayNotionSyncRequest = require('../../vendors/gov/metro/dtos/SubwayNotionSyncRequest');
const { subwayNotionSyncService } = require('../../sync/service');

router.post('/station-times-to-notion', SubwayNotionSyncRequest.validate(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const request = new SubwayNotionSyncRequest(req.body);
  await subwayNotionSyncService.syncStationTimetableToNotion(
    request.subway.stationId,
    request.subway.dailyCode,
    request.subway.upDownCode,
    request.notion.databaseId,
  );
  return res.json({ success: true });
});

router.post('/station-all-times-to-notion', SubwayNotionSyncRequest.validateEssential(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const request = new SubwayNotionSyncRequest(req.body);
  await subwayNotionSyncService.syncStationAllTimetableToNotion(
    request.subway.stationId,
    request.notion.databaseId,
  );
  return res.json({ success: true });
});

module.exports = router
