import { Schema, model, models } from "mongoose";

const commentSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  timestamp: { type: Date, default: Date.now },
});

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;