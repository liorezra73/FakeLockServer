const config = require("config");
const sql = require("mssql/msnodesqlv8");

//get connection from configuration
let dbConfig = config.get("server.connection");
//dbConfig is read only.
dbConfig = {...dbConfig};
dbConfig.options ={...dbConfig.options};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .catch(err => console.error(`${err.name}\n${err.message}`));

module.exports = poolPromise;
