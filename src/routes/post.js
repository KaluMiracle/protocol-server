import { response, Router } from "express";
import Comment from "../classes/Comment.js";
import Post from "../classes/Post.js";
const postRouter = Router();
import Meal from "../classes/Post.js";
import User from "../classes/User.js";

// postRouter.post("/", verifyToken, async (req, res) => {
//   console.log(req.body);
//   const user = req.user;

//   try {
//     const _user = new User(user);

//     const result = await _user.createPost(req.body);
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
postRouter.get("/", verifyToken, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const posts = await Post.getPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

postRouter.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.getPost(id);
    if (post == null) {
      return res.status(404).json({ message: "Post not Found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.json(res.Post);
});

postRouter.post("/:id/comments", verifyToken, async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const user = req.user;

  try {
    const comment = new Comment({
      ...req.body,
      post_id: id,
      user: user?._id,
    });
    const result = await comment.createComment();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
postRouter.get("/:id/comments", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.getPost(id);
    if (post == null) {
      return res.status(404).json({ message: "Post not Found" });
    }
    const comments = Post.getComments(post._id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.json(res.Post);
});
postRouter.delete(
  "/:id/comments/:comment_id",
  verifyToken,
  async (req, res) => {
    console.log(req.body);

    const { id, comment_id } = req.params;
    const user = req.user;

    try {
      const result = await Post.deleteComment(id, comment_id, user._id);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);
postRouter.post(
  "/:id/comments/:comment_id/like",
  verifyToken,
  async (req, res) => {
    const { id, comment_id } = req.params;
    const user = req.user;

    try {
      const result = await Comment.likeComment(comment_id, user._id);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

async function verifyToken(req, res, next) {
  try {
    const user = await User.authorize(req.get("Authorization").split(" ")[1]);
    req.user = user;
  } catch (err) {
    console.log(err.message);
    return res.status(403).json({ message: "Error" });
  }
  next();
}
export default postRouter;
