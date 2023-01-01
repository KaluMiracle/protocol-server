import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import mongoose from "mongoose";
import authRouter from "./src/routes/auth.js";
import postRouter from "./src/routes/post.js";
import userRouter from "./src/routes/user.js";

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
  next();
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(json());

app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(3001, () => console.log("Server Started"));
