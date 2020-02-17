const generateError = require("./generateError");

const dbErrors = [
  "ConnectionError",
  "TransactionError",
  "RequestError",
  "PreparedStatementError"
];

const dbErrorHandling = err => {
  dbErrors.forEach(error => {
    if (err.name === error) {
        //logger
      return generateError("DbError", "there was an error in the database!");
    }
  });
  return null;
};
module.exports = dbErrorHandling;
