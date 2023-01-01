import mongoose from "mongoose";

const PostDoc = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    caption: {
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
    comments: {
      type: Array,
      required: true,
    },
    stars: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostDoc);
