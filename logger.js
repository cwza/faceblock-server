const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const dir = '../logs';
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
  level: env === 'development' ? 'debug' : 'info',
  handleExceptions: true,
  colorize:true
});
const allLoggerTransport = new DailyRotateFile({
  name: 'all-file',
  filename: dir + '/all.log',
  timestamp:dateFormat,
  level: 'info',
  maxsize:1024*1024*10,
  datePattern:'.yyyy-MM-dd'
});
const errorTransport = new DailyRotateFile({
  name: 'error-file',
  filename: dir + '/error.log',
  timestamp:dateFormat,
  level: 'error',
  maxsize:1024*1024*10,
  handleExceptions: true,
  datePattern:'.yyyy-MM-dd'
});
const logger = new (winston.Logger)({
  transports: [
    consoleLoggerTransport,
    allLoggerTransport,
    errorTransport
  ]
});
if(env === 'development') {
  logger.remove('all-file');
  logger.remove('error-file');
}
module.exports = {
  logger
}
