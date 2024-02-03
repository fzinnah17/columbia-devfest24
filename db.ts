import mongoose from "mongoose";

let isConnected = false; // track the connection

const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Post model:', mongoose.models.Post);
    console.log('Like model:', mongoose.models.Like);
    console.log('Comment model:', mongoose.models.Comment);
    console.log('User model:', mongoose.models.User);
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
