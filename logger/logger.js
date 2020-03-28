const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: "./logger/error.log",
      level: "info"
    }),
    new winston.transports.File({ filename: "./logger/combined.log" })
  ]
});

module.exports = logger;
