// const config = require("config");
// const sql = require("mssql");

const poolPromise = (config, sql) => {
  //get connection from configuration
  let dbConfig = config.get("server.connection");
  //dbConfig is read only.
  dbConfig = { ...dbConfig };
  dbConfig.options = { ...dbConfig.options };

  return new sql.ConnectionPool(dbConfig).connect().catch((err) => {
    process.exit(1);
  });
};

module.exports = poolPromise;
