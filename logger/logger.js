// const winston = require("winston");

// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.json(),
//   defaultMeta: { service: "user-service" },
//   transports: [
//     new winston.transports.File({
//       filename: "./logger/error.log",
//       level: "info"
//     }),
//     new winston.transports.File({ filename: "./logger/combined.log" })
//   ]
// });

// module.exports = logger;

const loggerFactory = require("./loggerFactory");

const logger = {
  errorLogger: loggerFactory("./logger/error.log", "error", "file#error"),
  debugLogger: loggerFactory("./logger/debug.log", "debug", "file#debug"),
};

// for debug:  logger.debugLogger.debug("debug");  or logger.debugLogger.log("debug", "log");
//for errors:  logger.errorLogger.error("error");

module.exports = logger;
