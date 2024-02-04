import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: [true, "Name is required!"] },
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: [true, "Username already exists!"],
  },
  password: { type: String },
  profilePicUrl: { type: String },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  slider: {type: Number, default: 50}
});

const User = models.User || model("User", UserSchema);

export default User;
