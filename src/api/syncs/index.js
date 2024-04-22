const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const logger = require('../../lib/logger');
const SubwayNotionSyncRequest = require('../../dto/SubwayNotionSyncRequest');
const { subwayNotionSyncService } = require('../../service');

router.post('/station-times-to-notion', SubwayNotionSyncRequest.validate(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const request = new SubwayNotionSyncRequest(req.body);
  await subwayNotionSyncService.syncSubwayTimetableToNotion(
    request.subway.stationId,
    request.subway.dailyCode,
    request.subway.upDownCode,
    request.notion.databaseId,
  );
  return res.json({ success: true });
});


module.exports = router
