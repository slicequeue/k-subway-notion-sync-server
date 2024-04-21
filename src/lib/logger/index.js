const winstonLogger = require('./winston-logger').getInstance();
const sprintf = require('sprintf-js').sprintf;

function init(options) {
    function Logger() {

    }

    const logger = new Logger();

    /**
     * 로그 수행
     * @param level 레벨
     * @param req 서버 요청 인자
     * @param remain 나머지 입력 값들
     */
    logger.log = function (level, req) {
        var strLogMsg = '';
        var i;
        for (i = 2; i < arguments.length; i++) {
            strLogMsg += (' - ' + arguments[i]);
        }
        // 사용자 아이피 및 내용 삽입
        const strLogTotal = sprintf('%s - %s %s', req.userIp, req.originalUrl, strLogMsg); // '' + req.userIp + ' - ' + req.originalUrl + ' ' + strLogMsg; // TODO 사용자 정보 출력 필요
        // 윈스턴 로그 수행
        winstonLogger.log(level, strLogTotal);
    };

    /**
     * 서버 실행시 정보 출력 로깅
     * @param config
     * @param servAddr
     */
    logger.logServStart = function (config, servAddr) {
        // 서버 정보 출력 수행
        console.log('========================================================================================== SERV START INFO ==========================================================================================');
        // 실행 날짜
        winstonLogger.log('info', sprintf('%s SERVER START!', config.basic.name));
        winstonLogger.log('info', '[서버 정보]');
        winstonLogger.log('info', JSON.stringify(config.basic));
        console.log('======================================================================================================================================================================================================');
        winstonLogger.log('info', sprintf('서버 실행 주소: %s', servAddr));
        winstonLogger.log('info', sprintf('서버 실행 모드: %s', process.env.NODE_ENV));
        console.log('======================================================================================================================================================================================================');
        if (process.env.NODE_ENV === 'dev') {
            winstonLogger.log('info', '[데이터베이스 정보]');
            winstonLogger.log('info', JSON.stringify(config.db));
        }
    };

    /**
     * 서버 종료시 정보 로깅
     */
    logger.logServEnd = function (config) {
        console.log('==========================================================================================++ SERV END INFO ============================================================================================');
        // 실행 날짜
        winstonLogger.log('info', sprintf('%s SERVER END!', config.basic.name));
        console.log('======================================================================================================================================================================================================');
    };

    return logger;
}

var instance = null;

if (!instance)
    instance = init();

module.exports = instance;