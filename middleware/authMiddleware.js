const jwt = require("jsonwebtoken");
const config = require("config");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header(config.get("headerKey"));
    if (!token) return res.status(401).send("Access denied! no token provided");
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    if (!decoded)
      return res.status(401).send("Access denied! token is not valid");
    req.user = decoded;
    next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        res.status(401).send(err.message);
      case "JsonWebTokenError":
        res.status(401).send(err.message);
      default:
        res.status(500).send("something wrong happened in the server");
    }
  }
};
module.exports = authMiddleware;
