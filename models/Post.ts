import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  content: { type: String, required: true },
  image: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  rating: { type: Number, required: true }
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
