// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const container = require("../dependency_injection/containerConfig");
// const authMiddleware =container.getModule("authMiddleware"); // require("../middleware/authMiddleware");
// const commentLikeService = container.getModule("commentLikeService"); //require("../services/commentLikeService");
// const validator = require("express-joi-validation").createValidator({});
// const idModels = require("../Shared/models/idModels");
// const socketService = container.getModule("socketService"); //require("../services/socketService");

// router.use(authMiddleware);

const commentLikeController = (commentLikeService,socketService)=>{
  return {
    like:async (req, res, next) => {
      try {
        const { io } = req;
        const likes = await commentLikeService.doLike(
          req.user.id,
          req.params.commentId,
          io
        );
        socketService.onSocket(io, likes, "commentLike", "commentLikes");
        res.status(201).send({ ok: true });
      } catch (err) {
        switch (err.name) {
          case "CommentNotFound":
            err.status = 404;
            break;
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    },
    unLike: async (req, res, next) => {
      try {
        const { io } = req;
        const likes = await commentLikeService.unLike(
          req.user.id,
          req.params.commentId,
          io
        );
        socketService.onSocket(io, likes, "commentUnLike", "commentLikes");
        res.status(201).send({ ok: true });
      } catch (err) {
        switch (err.name) {
          case "CommentNotFound":
            err.status = 404;
            break;
          default:
            err.status = 500;
            break;
        }
        next(err);
      }
    }
  }
}
module.exports = commentLikeController

// router.post("/", async (req, res, next) => {
//   try {
//     const { io } = req;
//     const likes = await commentLikeService.doLike(
//       req.user.id,
//       req.params.commentId,
//       io
//     );
//     socketService.onSocket(io, likes, "commentLike", "commentLikes");
//     res.status(201).send({ ok: true });
//   } catch (err) {
//     switch (err.name) {
//       case "CommentNotFound":
//         err.status = 404;
//         break;
//       default:
//         err.status = 500;
//         break;
//     }
//     next(err);
//   }
// });

// router.delete("/", async (req, res, next) => {
//   try {
//     const { io } = req;
//     const likes = await commentLikeService.unLike(
//       req.user.id,
//       req.params.commentId,
//       io
//     );
//     socketService.onSocket(io, likes, "commentUnLike", "commentLikes");
//     res.status(201).send({ ok: true });
//   } catch (err) {
//     switch (err.name) {
//       case "CommentNotFound":
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
