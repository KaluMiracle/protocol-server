import { response, Router } from "express";
import Comment from "../classes/Comment.js";
import Post from "../classes/Post.js";
const userRouter = Router();
import Meal from "../classes/Post.js";
import User from "../classes/User.js";

userRouter.post("/posts", verifyToken, async (req, res) => {
  const user = req.user;

  try {
    const result = await User.createPost(user._id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.get("/posts", verifyToken, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const user = req.user;
  try {
    const posts = await user.getPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.delete("/posts/:id", verifyToken, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = req.params;

  const user = req.user;
  try {
    await User.deletePost(user._id, id);
    res.json("Post deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
userRouter.post("/like-post", verifyToken, async (req, res) => {
  const user = req.user;
  const { post_id } = req.body;

  try {
    const result = await Post.likePost(post_id, user._id?.toString());
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/star-post", verifyToken, async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { post_id, stars } = req.body;

  try {
    const result = await Post.starPost(post_id, user._id, stars);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function verifyToken(req, res, next) {
  try {
    const user = await User.authorize(req.get("Authorization").split(" ")[1]);
    req.user = new User(user);
  } catch (err) {
    console.log(err.message);
    return res.status(403).json({ message: "Error" });
  }
  next();
}
export default userRouter;
