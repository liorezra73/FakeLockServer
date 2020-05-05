//container
const container = require("kontainer-di");
//modules
const config = require("config");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
//db connections
const elsaticClient = require("../Data/elasticSearch"); // need config & client
const poolPromise = require("../Data/db"); //need config & sql
//errors&loggers
const logger = require("../logger/logger");
const dbErrorHandling = require("../errors/dbErrorHandling"); // need logger
const elasticSearchErrorHandling = require("../errors/elasticSearchErrorHandling"); // need logger
//repositories
const userRepository = require("../Data/repositories/userRepository"); // need poolPromise & sql
const postRepository = require("../Data/repositories/postRepository"); //need elsaticClient
const commentRepository = require("../Data/repositories/commentRepository"); //need elsaticClient
const likeRepository = require("../Data/repositories/likeRepository"); //need elsaticClient
//services
const passwordService = require("../services/passwordService"); // need bcrypt
const tokenService = require("../services/tokenService"); //need jwt & config
const authenticationService = require("../services/authenticationService");
// need userRepository & tokenService & dbErrorHandling & logger & passwordService
const userService = require("../services/userService");
//need userRepository & dbErrorHandling & logger & passwordService
const socketService = require("../services/socketService");
const photoService = require("../services/photoService");
// need  config, fs, logger
const postService = require("../services/postService");
// need postRepository & dbErrorHandling & elasticSearchErrorHandling  & photoService & userRepository & logger
const postLikeService = require("../services/postLikeService");
// need likeRepository,postRepository,elasticSearchErrorHandling,logger
const commentService = require("../services/commentService");
//need commentRepository,dbErrorHandling,elasticSearchErrorHandling,postRepository,userRepository,logger
const commentLikeService = require("../services/commentLikeService");
//need likeRepository,elasticSearchErrorHandling,logger,commentRepository
//middlewares
const authMiddleware = require("../middleware/authMiddleware");
//controllers
const authenticationController = require("../api/controllers/authenticationController");
//need authenticationService, config
const commentController = require("../api/controllers/commentController");
//need commentService,socketService
const commentLikeController = require("../api/controllers/commentLikeController");
// need commentLikeService,socketService
const photoController = require("../api/controllers/photoController");
//need photoService
const postController = require("../api/controllers/postController");
//need postService
const postLikeController = require("../api/controllers/postLikeController");
//need postLikeService,socketService
const userController = require("../api/controllers/userController");
//need userService,config
//validators
//models

//modules
container.registerModule("config", [], config);
container.registerModule("sql", [], sql);
// container.registerModule("Client", [], Client);
container.registerModule("jwt", [], jwt);
container.registerModule("bcrypt", [], bcrypt);
// container.registerModule("sharp", [], sharp);
// container.registerModule("uuidv4", [], uuidv4);
container.registerModule("fs", [], fs);
//db connections
container.registerModule("elsaticClient", ["config"], elsaticClient);
container.registerModule("poolPromise", ["config", "sql"], poolPromise);
//errors&loggers
// container.registerModule("generateError", [], generateError);
container.registerModule("logger", [], logger);
container.registerModule("dbErrorHandling", ["logger"], dbErrorHandling);
container.registerModule(
  "elasticSearchErrorHandling",
  ["logger"],
  elasticSearchErrorHandling
);

//repositories
container.registerModule(
  "userRepository",
  ["poolPromise", "sql"],
  userRepository
);
container.registerModule("postRepository", ["elsaticClient"], postRepository);
container.registerModule(
  "commentRepository",
  ["elsaticClient"],
  commentRepository
);
container.registerModule("likeRepository", ["elsaticClient"], likeRepository);

//others

//services
container.registerModule("passwordService", ["bcrypt"], passwordService);
container.registerModule("tokenService", ["jwt", "config"], tokenService);
container.registerModule("socketService", [], socketService);
container.registerModule(
  "authenticationService",
  [
    "userRepository",
    "tokenService",
    "dbErrorHandling",
    "logger",
    "passwordService",
  ],
  authenticationService
);
container.registerModule(
  "userService",
  ["userRepository", "dbErrorHandling", "logger", "passwordService"],
  userService
);
container.registerModule(
  "photoService",
  ["config", "fs", "logger"],
  photoService
);
container.registerModule(
  "postService",
  [
    "postRepository",
    "dbErrorHandling",
    "elasticSearchErrorHandling",
    "photoService",
    "userRepository",
    "logger",
  ],

  postService
);
container.registerModule(
  "postLikeService",
  ["likeRepository", "postRepository", "elasticSearchErrorHandling", "logger"],
  postLikeService
);
container.registerModule(
  "commentService",
  [
    "commentRepository",
    "dbErrorHandling",
    "elasticSearchErrorHandling",
    "postRepository",
    "userRepository",
    "logger",
  ],
  commentService
);
container.registerModule(
  "commentLikeService",
  [
    "likeRepository",
    "elasticSearchErrorHandling",
    "logger",
    "commentRepository",
  ],
  commentLikeService
);

container.registerModule(
  "authMiddleware",
  ["config", "tokenService"],
  authMiddleware
);

//controllers
container.registerModule(
  "authenticationController",
  ["authenticationService", "config"],
  authenticationController
);
container.registerModule(
  "commentController",
  ["commentService", "socketService"],
  commentController
);
container.registerModule(
  "commentLikeController",
  ["commentLikeService", "socketService"],
  commentLikeController
);
container.registerModule("photoController", ["photoService"], photoController);
container.registerModule("postController", ["postService"], postController);
container.registerModule(
  "postLikeController",
  ["postLikeService", "socketService"],
  postLikeController
);
container.registerModule(
  "userController",
  ["userService", "config"],
  userController
);

module.exports = container;
