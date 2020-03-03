const generateError = require("./generateError");
const logger = require("../logger/logger");

const dbErrors = [
  "ConnectionError",
  "TransactionError",
  "RequestError",
  "PreparedStatementError"
];

const dbErrorHandling = err => {
  dbErrors.forEach(error => {
    if (err.name === error) {
      logger.error(err);
      return generateError("DbError", "there was an error in the database!");
    }
  });
  return null;
};
module.exports = dbErrorHandling;
