const config = require("config");
const sql = require("mssql");

//get connection from configuration
let dbConfig = config.get("server.connection");
//dbConfig is read only.
dbConfig = { ...dbConfig };
dbConfig.options = { ...dbConfig.options };

const poolPromise = new sql.ConnectionPool(dbConfig).connect().catch(err => {
  process.exit(1);
});

module.exports = poolPromise;
