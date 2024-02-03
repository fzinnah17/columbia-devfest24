import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const Image = models.Image || model("Image", ImageSchema);

export default Image;
