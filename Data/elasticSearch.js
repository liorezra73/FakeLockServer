const { Client } = require("@elastic/elasticsearch");
const config = require("config");

const elasticNodeConfig = config.get("elasticNode");
const elsaticClient = new Client({ node: elasticNodeConfig });
module.exports = elsaticClient;
