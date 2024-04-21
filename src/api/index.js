const path = require('path');
const config = require('../config');

var express = require('express');
var router = express.Router();

const mdeIpGrabber = require('../lib/ip-grabber');
const logger = require('../lib/logger');

/* Test */
router.use('/test', mdeIpGrabber, require('./test'));

router.get('/', mdeIpGrabber, function (req, res, next) {
    logger.log('info', req, '연결 테스트 수행');
    res.json({title: config.basic.name, ver: config.basic.version});
});

module.exports = router;
