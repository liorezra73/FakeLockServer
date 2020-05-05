const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint, colorize, errors } = format;

const loggerFactory = (filename, level, name) => {
  return createLogger({
    format: combine(
      errors({ stack: true, trace: true }), // <-- use errors format
      colorize(),
      timestamp(),
      prettyPrint(),
      label()
    ),
    transports: [
      new transports.File({
        filename: filename,
        level: level,
        name: name,
      }),
    ],
  });
};

module.exports = loggerFactory;
