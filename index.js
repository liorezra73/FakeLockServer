var express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const swaggerTools = require("swagger-tools");
const jsyaml = require("js-yaml");
const fs = require("fs");
const container = require("./dependency_injection/containerConfig");
const logger = container.getModule("logger");



const options = {
  controllers: "./api/controllers",
  useStubs: process.env.NODE_ENV === "development" ? true : false, // Conditionally turn on stubs (mock mode)
};

let swaggerDoc;

try {
  let fileContents = fs.readFileSync("./swagger/swagger.yaml", "utf8");
  swaggerDoc = jsyaml.safeLoad(fileContents);
} catch (e) {
  logger.errorLogger.error(err);
}


swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

//routs
const userRoute = require("./api/routes/userRoute");
const authRoute = require("./api/routes/authenticationRoute");
const postRoute = require("./api/routes/postRoute");
const commentRoute = require("./api/routes/commentRoute");
const postLikeRoute = require("./api/routes/postLikeRoute");
const photoRoute = require("./api/routes/photoRoute");
const commentLikeRoute = require("./api/routes/commentLikeRoute");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(
  "/staticFiles/postsPhotos",
  express.static(__dirname + "/staticFiles/postsPhotos")
);
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/posts/:postId/comments/:commentId/likes", commentLikeRoute);
app.use("/api/posts/:postId/comments", commentRoute);
app.use("/api/posts/:postId/likes", postLikeRoute);
app.use("/api/posts", postRoute);
app.use("/api/photos", photoRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
//error handler middleware
app.use((err, req, res, next) => {
  if (err.status < 500) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send("Something broke!");
  }
});

//check config
if (!config.get("jwtPrivateKey")) {
  console.error("error-jwt key not defined");
  process.exit(1);
}
if (!config.get("server")) {
  console.error("server not defined");
  process.exit(1);
}
if (!config.get("headerKey")) {
  console.error("headerKey not defined");
  process.exit(1);
}
if (!config.get("port")) {
  console.error("headerKey not defined");
  process.exit(1);
}

const port = config.get("port");
//run server
module.exports.server = server.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

