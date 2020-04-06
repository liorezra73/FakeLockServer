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

const { createLogger, format, transports } = require("winston");
const {
  combine,
  timestamp,
  label,
  printf,
  simple,
  prettyPrint,
  colorize,
  errors
} = format;

const myFormat = printf(info => {
  return info.trace[0].file + ":" + info.trace[0].line + " | ";
});

const logger = createLogger({
  level: "info",
  format: combine(
    errors({ stack: true,trace: true}), // <-- use errors format
    colorize(),
    timestamp(),
    prettyPrint(),
    label()
  ),
  transports: [
    new transports.File({ filename: "./logger/error.log" }),
    new transports.File({ filename: "./logger/combined.log" })
  ]
});
module.exports = logger;
