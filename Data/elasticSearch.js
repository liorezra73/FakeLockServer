const { Client } = require("@elastic/elasticsearch");
// const config = require("config");

const elsaticClient = (config) => {
  const elasticNodeConfig = config.get("elasticNode");
  return new Client({ node: elasticNodeConfig });
};

module.exports = elsaticClient;
