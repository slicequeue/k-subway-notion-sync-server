const path = require('path');
// 윈스턴 모듈
const winston = require('winston');
// 윈스턴 날짜 별 하루 로테이션 수행 모듈
const WinstonDailyRotateFile = require('winston-daily-rotate-file');
// 데이트 유틸
require('date-utils');
// const sprintf = require('sprintf-js').sprintf;
// 로그 경로 설정
const logDir = process.cwd();
const logFolder = 'logs';
const dirLogs =   path.join(logDir, logFolder);

const utilDirectory = require('./utilDir');

// / error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     verbose: 3,
//     debug: 4,
//     silly: 5
// };

const tsFormat = function () { return (new Date()).toLocaleTimeString() };

/**
 * 초기화 진행전 정의 - 싱글턴 패턴으로 변경
 * @type {{getInstance}}
 */
module.exports = /* singleton = */ (function () {
    /** singleton instance */
    var instance;

    /**
     * 초기화 수행 함수
     * @returns {*}
     */
    function Initiate() {
        // 로그 파일 없는 경우 경로 생성
        if (!utilDirectory.searchFolder(logDir, logFolder)) {
            utilDirectory.createFolder(logDir, logFolder);
        }
        return (winston.createLogger)({
            transports: [
                new (winston.transports.Console)({
                    name: 'consoleLog',
                    colorize: false,
                    format: winston.format.combine(

                        winston.format.timestamp(),
                        winston.format.simple()
                        // winston.format.timestamp(),
                        // winston.format.json()
                    ),
                    timestamp: tsFormat
                }),

                new (WinstonDailyRotateFile)({
                    name: 'infoLog',
                    level: 'info',
                    colorize: false,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                    filename: '' + dirLogs + '/%DATE%-info.log',
                    datePattern: 'YYYY-MM-DD',
                    maxsize: 1000000,
                    maxFiles: 5,
                    timestamp: tsFormat
                }),

                new (WinstonDailyRotateFile)({
                    name: 'errorLog',
                    level: 'error',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                    filename: '' + dirLogs + '/%DATE%-error.log',
                    datePattern: 'YYYY-MM-DD',
                    maxsize: 1000000,
                    maxFiles: 5,
                    timestamp: tsFormat
                })
            ]
        });
    }
    // 싱글턴
    return {
        getInstance: function() {
            if (!instance) {
                instance = new Initiate();
            }
            return instance;
        }
    };
}());
