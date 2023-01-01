import { response, Router } from "express";
const authRouter = Router();
import User from "../classes/User.js";

authRouter.get("/", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const token = req.get("Authorization").split(" ")[1];
    const user = await User.authorize(token);
    res.status(201).json({ value: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
authRouter.post("/signin", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const user = new User({
      ...req.body,
    });
    const result = await user.signIn();
    res.status(201).json({ value: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
authRouter.post("/signup", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const user = new User({
      ...req.body,
    });
    const result = await user.signUp();
    res.json({ value: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default authRouter;
