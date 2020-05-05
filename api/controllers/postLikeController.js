// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const container = require("../dependency_injection/containerConfig");
// const authMiddleware = container.getModule("authMiddleware"); //require("../middleware/authMiddleware");
// const postLikeService =container.getModule("postLikeService"); //require("../services/postLikeService");
// const socketService = container.getModule("socketService"); //require("../services/socketService");
// router.use(authMiddleware);

const postLikeController = (postLikeService, socketService) => {
  return {
    like: async (req, res, next) => {
      try {
        const { io } = req;
        const likes = await postLikeService.doLike(
          req.user.id,
          req.params.postId
        );
        socketService.onSocket(io, likes, "postLike", "postLikes");
        res.status(201).send({ ok: true });
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
    unLike: async (req, res, next) => {
      try {
        const { io } = req;
        const likes = await postLikeService.unLike(
          req.user.id,
          req.params.postId
        );
        socketService.onSocket(io, likes, "postUnLike", "postLikes");
        res.status(200).send({ ok: true });
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

// router.post("/", async (req, res, next) => {
//   try {
//     const { io } = req;
//     const likes = await postLikeService.doLike(req.user.id, req.params.postId);
//     socketService.onSocket(io,likes,"postLike","postLikes")
//     res.status(201).send({ ok: true });
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

// router.delete("/", async (req, res, next) => {
//   try {
//     const { io } = req;
//     const likes = await postLikeService.unLike(req.user.id, req.params.postId);
//     socketService.onSocket(io,likes,"postUnLike","postLikes")
//     res.status(200).send({ ok: true });
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

module.exports = postLikeController;
// module.exports = router;
