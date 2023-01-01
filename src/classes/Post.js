import CommentDoc from "../models/CommentDoc.js";
import PostDoc from "../models/PostDoc.js";
import Comment from "./Comment.js";
import User from "./User.js";

class Post {
  _id = "";
  user = "";
  author = "anonymous";
  caption = "";
  body = "";
  likes = [];
  comments = [];
  meal;
  stars = [0, 0];

  constructor(post) {
    Object.entries(post).map(([key, value]) => {
      this[key] = value;
    });
    this.post = {
      user: this.user,
      author: this.author,
      caption: this.caption,
      body: this.body,
      likes: this.likes,
      comments: this.comments,
      stars: this.stars,
    };
  }

  createPost = async () => {
    const Doc = new PostDoc(this.post);
    await Doc.save();
    return Doc;
  };
  deletePost = async () => {
    const Doc = await CommentDoc.findById(this.post_id);
    const post = await PostDoc.findById(this.post_id);
    post.comments = post.comments.filter((id) => id !== Doc.id);
    post.save();
    await Doc.delete();

    return Doc;
  };
  static likePost = async (post_id, user_id) => {
    const post = await PostDoc.findById(post_id);
    if (post.likes.includes(user_id)) {
      post.likes = post.likes.filter((user) => user !== user_id);
    } else {
      post.likes.push(user_id);
    }
    await post.save();

    return post;
  };
  static getPosts = async () => {
    const posts = await PostDoc.find();

    return posts;
  };
  static getPost = async (id) => {
    const post = await PostDoc.findById(id);
    if (!post) {
      throw new Error("post not found");
    }

    return post;
  };
  static deletePost = async (id) => {
    const post = await PostDoc.findById(id);
    console.log(id, post);
    await Promise.all(
      post.comments.map(async (id) => {
        await Comment.deleteComment(id);
      })
    );

    post.delete();

    return post;
  };

  static addComment = async (post_id, comment_id) => {
    const post = await PostDoc.findById(post_id);
    if (!post) {
      throw new Error("Post not found");
    }
    post.comments.push(comment_id);
    await post.save();
  };

  static starPost = async (post_id, stars) => {
    if (!(0 <= parseInt(stars) <= 5)) {
      throw new Error("Stars must be a number between 0 and 5");
    }
    const post = await PostDoc.findById(post_id);
    const averageStars = (parseInt(post.stars[0]) + stars) / 5;
    post.stars = [averageStars, parseInt(post.stars[1]) + 1];

    post.save();

    return post;
  };
  static getComments = async (post_id) => {
    const post = await PostDoc.findById(post_id);

    const comments = await Promise.all(
      post.comments.map(async (comment_id) => {
        const comment = await Comment.getComment(comment_id);
        const user = await User.getUser(comment.user);
        return { ...comment.comment, username: user.name || user.email };
      })
    );

    return comments;
  };
  static deleteComment = async (post_id, comment_id, user_id) => {
    const post = await PostDoc.findById(post_id);
    console.log(post.user);
    console.log(user_id);
    if (user_id != post.user) {
      throw new Error("Only post author can delete comments");
    }
    post.comments = post.comments.filter((id) => id.toString() !== comment_id);
    post.save();
    const comment = await Comment.deleteComment(comment_id);
    return comment;
  };
}
export default Post;
