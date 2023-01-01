import mongoose from "mongoose";

const CommentDoc = new mongoose.Schema(
  {
    post_id: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentDoc);
