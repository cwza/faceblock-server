const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
const fs = require('fs');
const configs = require('./configs');

const env = process.env.NODE_ENV || 'development';
const dir = configs.logger.dir;
const dateFormat = function() {
	return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};
// Create the log directory if it does not exist
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
const consoleLoggerTransport = new (winston.transports.Console)({
  name: 'console',
  timestamp:dateFormat,
  level: env === 'production' ? 'debug' : 'debug',
  // handleExceptions: true,
  colorize:true
});
const allLoggerTransport = new DailyRotateFile({
  name: 'all-file',
  filename: dir + '/all.log',
  timestamp:dateFormat,
  level: 'debug',
  maxsize:1024*1024*10,
  // handleExceptions: true,
  datePattern:'.yyyy-MM-dd'
});
const errorTransport = new DailyRotateFile({
  name: 'error-file',
  filename: dir + '/error.log',
  timestamp:dateFormat,
  level: 'error',
  maxsize:1024*1024*10,
  // handleExceptions: true,
  datePattern:'.yyyy-MM-dd'
});
const logger = new (winston.Logger)({
  transports: [
    consoleLoggerTransport,
    allLoggerTransport,
    errorTransport
  ],
  exitOnError: false
});
if(env === 'development') {
  logger.remove('all-file');
  logger.remove('error-file');
}
module.exports = {
  logger
}
