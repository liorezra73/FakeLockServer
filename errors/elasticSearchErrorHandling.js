const generateError = require("./generateError");
const logger = require("../logger/logger");

const elasticErrors = [
  "ElasticsearchClientErrors",
  "TimeoutError",
  "ConnectionError",
  "NoLivingConnectionsError",
  "SerializationError",
  "DeserializationError",
  "ConfigurationError",
  "ResponseError"
];

const elasticSearchErrorHandling = err => {
    elasticErrors.forEach(error => {
    if (err.name === error) {
      logger.error();
      return generateError("ElasticSearchError", "there was an error in the elastic search!");
    }
  });
  return null;
};
module.exports = elasticSearchErrorHandling;