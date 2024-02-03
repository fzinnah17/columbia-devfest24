import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  timestamp: { type: Date, default: Date.now },
});

const Like = models.Like || model("Like", LikeSchema);

export default Like;
