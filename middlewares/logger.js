const winston = require("winston");
const expressWinston = require("express-winston");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");

const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta.error?.stack || message}`
  )
);

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({ format: messageFormat }),
    new winston.transports.File({
      filename: path.join(logsDir, "request.log"), //  Save to logs/request.log
      format: winston.format.json(),
    }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"), //  Save to logs/error.log
      format: winston.format.json(),
    }),
  ],
});

module.exports = { requestLogger, errorLogger };
