'use server';
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";

import connectToDB from "../db";
import bcrypt from "bcryptjs";
import { RegisterSchema, formSchema } from "@/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

Comment 
Like

 export async function createUser(userDetails : { name : string; username: string; password: string; profilePicUrl?: string}) {
    // Destructure the userDetails to extract the required fields
    const validatedFields = RegisterSchema.safeParse(userDetails);
    if (validatedFields.success) {
      await connectToDB();
      const { name, username, password, profilePicUrl } = validatedFields.data;
    
      const user = await User.findOne({ username: username });
    if (user) {
      throw new Error('Username already taken');
    }
    // username available, save user to db
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const user = new User({
        name,
        username,
        password: hashedPassword,
        profilePicUrl: profilePicUrl ?? null,
      });
      await user.save();
      return JSON.stringify({ username, password });
    } catch (err) {
      throw new Error(`Unable to create new user: ${err}`);
    }
  } 
    else {
      throw new Error('Something went wrong');
    }
  
    
  }

  export async function getProfileUrl(userId : string) {
    await connectToDB();
    try {
      // Attempt to find the user by their ID
      const user = await User.findById(userId);
  
      if (user) {
        return user.profilePicUrl;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile URL:', error);
      throw error;
    }
  }

 export async function getHomePosts(userId : string, startId? : string) {
  await connectToDB();
  // console.log('Post model:', mongoose.models.Post);
  // console.log('Like model:', mongoose.models.Like);
  // console.log('Comment model:', mongoose.models.Comment);
  // console.log('User model:', mongoose.models.User);
    const currentUser = await User.findById(userId);
    // all your posts and your friends' posts
    const usersIds = [currentUser._id, ...currentUser.friends];
    try {
      if (!startId) {
          const posts = await Post.find({ user: { $in: usersIds } })
            .sort({ _id: -1 })
            .populate("user")
            .limit(10)      // remove this when ml api ready
            .populate({
              path: "likes",
              populate: {
                path: "user",
              },
            })
            .populate({
              path: "comments",
              populate: {
                path: "user",
              },
            });
          // input posts in ML api. It will return all home feed posts that align with your 
          // slider. If there are 11 posts, nextCursor is 10th post's id, else dont return cursor
            console.log('POTST ARE ', posts);
          return JSON.stringify(posts);
      }
      else {
          // user clicked on 'show more'. Theres a cursor
          const posts = await Post.find({ user: { $in: usersIds } })
          .where("_id")
          .lt(startId)        // must be < cursor since cursor was included in prev batch
          .sort({ _id: -1 })
          .populate("user")
          .populate({
            path: "likes",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "comments",
            populate: {
              path: "user",
            },
          });
          // input posts in ML api. It will return all home feed posts that were created after 
          // the prev batch, all aligning with your slider 
          return JSON.stringify(posts);
      }
    } catch (err) {
      console.log(err);
      throw new Error(`Error fetching home feed: ${err}`);
    }
  }

export async function getUser(userId : string) {
  await connectToDB();
    try {
      const user = await User.findById(userId).populate(
        "friends friendRequestsSent friendRequestsReceived",
      );
      if (!user) {
        throw new Error("cant find user");
      }
      return user;
    } catch (e) {
      throw new Error(`error occurred when trying to get user data: ${e}`);
    }
  }


export async function createNewPost(values) {
  const session = await getServerSession(authOptions);
  const validatedFields = formSchema.safeParse(values);
  if (validatedFields.success) {
    const { content, image } = validatedFields.data;
  try {
    await connectToDB();
    // Create a new post instance
    const newPost = new Post({
      content,
      user: session.user.userId,
      image,
    });
    const currentUser = await User.findById(session?.user.userId);

    // const comment = new Comment({
    //   content: 'dasd',
    //   user: userId,
    //   post: newPost._id
    // })
    // await comment.save();
    // Save the post to the database
    const savedPost = await newPost.save();

    currentUser.posts.push(savedPost);
    await currentUser.save();

    // populate the new post before returning it since we'll call setPost() with it
    const populatedPost = await Post.findById(newPost._id)
      .populate("user")
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
      return JSON.stringify(populatedPost);
  } catch (error) {
    // Handle potential errors
    console.error('Error creating a new post:', error);
    throw error;
  }
}
else {
  throw new Error('Something went wrong');
}
}

export async function getUserPosts(userId : string, startId? : string) {
  await connectToDB();
    const currentUser = await User.findById(userId);
    try {
      if (!startId) {
          const posts = await Post.find({ user: currentUser._id })
            .sort({ _id: -1 })
            .populate("user")
            .limit(10)      // remove this when ml api ready
            .populate({
              path: "likes",
              populate: {
                path: "user",
              },
            })
            .populate({
              path: "comments",
              populate: {
                path: "user",
              },
            });
          // input posts in ML api. It will return all user posts that align with your 
          // slider. 
            return JSON.stringify(posts);
      }
      else {
          // user clicked on 'show more'. Theres a cursor
          const posts = await Post.find({ user: currentUser._id })
          .where("_id")
          .lt(startId)        // must be < cursor since cursor was included in prev batch
          .sort({ _id: -1 })
          .populate("user")
          .populate({
            path: "likes",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "comments",
            populate: {
              path: "user",
            },
          });
          // input posts in ML api. It will return all home feed posts that were created after 
          // the prev batch, all aligning with your slider. If there are 11 posts, nextCursor 
          // is 10th post's id, else dont return cursor
          return JSON.stringify(posts);
      }
    } catch (err) {
      console.log(err);
      throw new Error(`Error fetching home feed: ${err}`);
    }
  }