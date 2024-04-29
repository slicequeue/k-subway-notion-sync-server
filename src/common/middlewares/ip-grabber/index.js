const requestIp = require('request-ip');

function init(options) {
    return function (req, res, next) {
        req.userIp = requestIp.getClientIp(req);
        // console.log(req.userIp);
        next(null, req, res);
    }
}// end of function

module.exports = init();