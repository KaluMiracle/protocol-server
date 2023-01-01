import mongoose from "mongoose";

const UserDoc = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  likes: {
    type: Array,
    required: true,
  },
  posts: {
    type: Array,
    required: true,
  },
});

export default mongoose.model("User", UserDoc);
