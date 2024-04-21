var express = require('express');
var router = express.Router();

const ctrler = require('./ctrler');

router.get('/', ctrler.getTest);

module.exports = router;
