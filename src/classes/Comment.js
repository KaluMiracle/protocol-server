import CommentDoc from "../models/CommentDoc.js";
import PostDoc from "../models/PostDoc.js";
import Post from "./Post.js";
import User from "./User.js";

class Comment {
  post_id = "";
  user = "anonymous";
  body = "";
  likes = [];
  comment;

  constructor(post) {
    Object.entries(post).map(([key, value]) => {
      this[key] = value;
    });
    this.comment = {
      post_id: this.post_id,
      user: this.user,
      body: this.body,
      likes: this.likes,
    };
  }

  createComment = async () => {
    const Doc = new CommentDoc(this.comment);
    await Post.addComment(this.post_id, Doc._id);

    await Doc.save();

    return Doc;
  };
  static deleteComment = async (comment_id) => {
    const Doc = await CommentDoc.findById(comment_id);
    if (!Doc) {
      throw new Error("Comment not found");
    }
    await Doc.delete();

    return Doc;
  };

  static getComment = async (id) => {
    const comment = await CommentDoc.findById(id);

    return new Comment(comment);
  };
  static likeComment = async (id, user_id) => {
    const comment = await CommentDoc.findById(id);
    if (comment.likes.includes(user_id)) {
      comment.likes = comment.likes.filter(
        (user) => user.toString() !== user_id.toString()
      );
    } else {
      comment.likes.push(user_id);
    }
    await comment.save();
    return comment;
  };
}
export default Comment;
