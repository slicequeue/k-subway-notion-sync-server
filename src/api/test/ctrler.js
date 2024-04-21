const path = require('path');
var logger = require('../../lib/logger');
const Code = require('../../types/code');

const async = require('async');

exports.getTest = function (req, res, next) {
    logger.log('info', req, 'test');
    res.json({val: 'test!'});
};