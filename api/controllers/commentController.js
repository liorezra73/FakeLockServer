// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const container = require("../dependency_injection/containerConfig");
// const authMiddleware = container.getModule("authMiddleware"); // require("../middleware/authMiddleware");
// const commentService = container.getModule("commentService"); // require("../services/commentService");
// const commentModel = require("../Shared/models/comment");
// const validator = require("express-joi-validation").createValidator({});
// const commentsQuery = require("../Shared/models/commentsQuery");
// const idModels = require("../Shared/models/idModels");
// const socketService = container.getModule("socketService"); // require("../services/socketService");
// router.use(authMiddleware);

const commentController = (commentService,socketService) => {
  return {
    getCommentsByPostId: async (req, res, next) => {
      try {
        const result = await commentService.getCommentsByPostId(
          req.params.postId,
          req.user.id,
          req.query
        );
        res.status(200).send(result);
      } catch (err) {
        switch (err.name) {
          case "PostNotFound":
            err.status = 400;
            break;
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    },

    createComment: async (req, res, next) => {
      try {
        const { io } = req;
        const result = await commentService.createComment(
          req.body,
          req.user.id,
          req.params.postId
        );
        socketService.onSocket(io, result.count, "comment", "comments");
        res.status(201).send(result.comment);
      } catch (err) {
        switch (err.name) {
          case "PostNotFound":
            err.status = 404;
            break;
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    },
  };
};

module.exports = commentController;

// router.get("/", validator.query(commentsQuery), async (req, res, next) => {
//   try {
//     const result = await commentService.getCommentsByPostId(
//       req.params.postId,
//       req.user.id,
//       req.query
//     );
//     res.status(200).send(result);
//   } catch (err) {
//     switch (err.name) {
//       case "PostNotFound":
//         err.status = 400;
//         break;
//       default:
//         err.status = 500;
//         break;
//     }
//     next(err);
//   }
// });

// router.post("/", validator.body(commentModel), async (req, res, next) => {
//   try {
//     const { io } = req;
//     const result = await commentService.createComment(
//       req.body,
//       req.user.id,
//       req.params.postId
//     );
//     socketService.onSocket(io, result.count, "comment", "comments");
//     res.status(201).send(result.comment);
//   } catch (err) {
//     switch (err.name) {
//       case "PostNotFound":
//         err.status = 404;
//         break;
//       default:
//         err.status = 500;
//         break;
//     }
//     next(err);
//   }
// });
// module.exports = router;
