import jwt from "jsonwebtoken";
import UserDoc from "../models/UserDoc.js";
import Comment from "./Comment.js";
import Post from "./Post.js";

class User {
  email = "";
  password = 0;
  name = "";
  role = "user";
  posts = [];
  access_token = "";
  _id = "";
  user;
  constructor(user) {
    Object.entries(user).map(([key, value]) => {
      this[key] = value;
    });
    this.user = {
      user: this.user,
      password: this.password,
      name: this.name,
      role: this.role,
      posts: this.posts,
    };
  }

  signUp = async () => {
    const password_hash = jwt.sign(this.password, process.env.KEY);
    const user = await UserDoc.findOne({ email: this.email });

    if (user) {
      throw new Error("Email already in use");
    }
    const Doc = new UserDoc({
      email: this.email,
      password_hash,
      name: this.name,
      role: this.role,
    });

    await Doc.save();
    return await this.signIn();
  };
  signIn = async () => {
    const user = await UserDoc.findOne({ email: this.email });
    if (!user) {
      throw new Error("Email not found");
    }

    const userPassword = jwt.verify(user.password_hash, process.env.KEY);
    if (this.password != userPassword) {
      throw new Error("Incorrect password");
    }
    return {
      ...user._doc,

      access_token: jwt.sign({ token: user._id.toString() }, process.env.KEY, {
        expiresIn: "24h",
      }),
    };
  };
  getPosts = async () => {
    const posts = await Promise.all(
      this.posts.map(async (post_id) => {
        const post = await Post.getPost(post_id);
        return post;
      })
    );
    return posts;
  };
  static createPost = async (user_id, body) => {
    const user = await UserDoc.findById(user_id);
    if (!user) {
      throw new Error("user not found");
    }
    const post = new Post({
      ...body,
      user: user_id,
      author: user.name || user.email,
    });
    const result = await post.createPost();
    user.posts.push(result._id);
    await user.save();
    return result;
  };
  static deletePost = async (user_id, post_id) => {
    const post = await Post.getPost(post_id);
    if (post?.user != user_id) {
      throw new Error("Error: post not found");
    }
    await Post.deletePost(post_id);
    const user = await UserDoc.findById(user_id);
    console.log(user.posts);
    user.posts = user.posts.filter((id) => id.toString() !== post_id);
    console.log(user.posts);

    await user.save();
  };
  static getUser = async (id) => {
    try {
      const user = await UserDoc.findById(id);
      return new User(user._doc);
    } catch (error) {
      return new User({ name: id });
    }
  };
  static authorize = async (token) => {
    if (!token) {
      throw new Error("Token must be provided");
    }
    var id = jwt.verify(token, process.env.KEY);
    const user = await UserDoc.findById(id.token || id.tokenn);
    if (!user) {
      throw new Error("Not Authorized");
    }
    return {
      ...user._doc,

      access_token: jwt.sign({ token: user._id.toString() }, process.env.KEY, {
        expiresIn: "24h",
      }),
    };
  };
}
export default User;
