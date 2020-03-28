var express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const cors = require("cors");

//routs/controllers
const userRoute = require("./controllers/userController");
const authRoute = require("./controllers/authenticationController");
const postRoute = require("./controllers/postController");
const commentRoute = require("./controllers/commentController");
const postLikeRoute = require("./controllers/postLikeController");
const photoRoute = require("./controllers/photoController");
const commentLikeRoute = require("./controllers/commentLikeController");
const elasticClient = require("./Data/elasticSearch");
elasticClient();

const app = express();

app.use(
  "/staticFiles/postsPhotos",
  express.static(__dirname + "/staticFiles/postsPhotos")
);
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
module.exports.listen = app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
