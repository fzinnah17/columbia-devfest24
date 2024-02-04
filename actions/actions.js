'use server';
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";

import connectToDB from "../db";
import bcrypt from "bcryptjs";
import { RegisterSchema, formSchema } from "@/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { updateProfileSchema } from '@/schemas'

Comment
Like

export async function getSlider() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.userId);
  const slider = user.slider;
  return slider;
}

export async function updateSlider(newSlider) {
  await connectToDB();
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.userId;
    const user = await User.findByIdAndUpdate(userId, {
      slider: newSlider,
    });
  }
  catch (err) {
    throw new Error(err);
  }
}

export async function createUser(userDetails) {
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

export async function getProfileUrl(userId) {
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

export async function getHomePosts(userId, startId) {
  await connectToDB();
  const currentUser = await User.findById(userId);
  const slider = await getSlider();
  // all your posts and your followings' posts
  const usersIds = [currentUser._id, ...currentUser.following];
  try {
    if (!startId) {
      const posts = await Post.find({ user: { $in: usersIds } })
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


      // Determine thresholds or acceptance criteria based on the slider value
      let acceptableRange;
      if (slider < 20) {   // Seeking very liberal content
        acceptableRange = [0, 1];
      } else if (slider < 40) { // Seeking liberal content
        acceptableRange = [0, 2];
      } else if (slider < 60) { // Seeking neutral content
        acceptableRange = [1, 3];
      } else if (slider < 80) { // Seeking conservative content
        acceptableRange = [2, 4];
      } else {             // Seeking very conservative content
        acceptableRange = [3, 4];
      }

      // Filter the array based on the threshold, preserving the original order
      const filteredArray = posts.filter(obj =>
        obj.rating >= acceptableRange[0] && obj.rating <= acceptableRange[1]
      );

      // Take the first 10 items from the filtered array
      const top10Filtered = filteredArray.slice(0, 10);
      return JSON.stringify(top10Filtered);
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
      // Determine thresholds or acceptance criteria based on the slider value
      let acceptableRange;
      if (slider < 20) {   // Seeking very liberal content
        acceptableRange = [0, 1];
      } else if (slider < 40) { // Seeking liberal content
        acceptableRange = [0, 2];
      } else if (slider < 60) { // Seeking neutral content
        acceptableRange = [1, 3];
      } else if (slider < 80) { // Seeking conservative content
        acceptableRange = [2, 4];
      } else {             // Seeking very conservative content
        acceptableRange = [3, 4];
      }

      // Filter the array based on the threshold, preserving the original order
      const filteredArray = posts.filter(obj =>
        obj.rating >= acceptableRange[0] && obj.rating <= acceptableRange[1]
      );

      // Take the first 10 items from the filtered array
      const top10Filtered = filteredArray.slice(0, 10);

      return JSON.stringify(top10Filtered);
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Error fetching home feed: ${err}`);
  }
}



export async function getAllPosts(startId) {
  await connectToDB();
  const slider = await getSlider();


  if (startId) {
    try {
      const posts = await Post.find()
        .where("_id")
        .lt(startId)
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


      return JSON.stringify(posts);


    } catch (err) {
      throw new Error(err);
    }
  } else {
    try {
      const posts = await Post.find()
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

      // posts is a giant array of posts objects that each has a rating

      // Determine thresholds or acceptance criteria based on the slider value
      let acceptableRange;
      if (slider < 20) {   // Seeking very liberal content
        acceptableRange = [0, 1];
      } else if (slider < 40) { // Seeking liberal content
        acceptableRange = [0, 2];
      } else if (slider < 60) { // Seeking neutral content
        acceptableRange = [1, 3];
      } else if (slider < 80) { // Seeking conservative content
        acceptableRange = [2, 4];
      } else {             // Seeking very conservative content
        acceptableRange = [3, 4];
      }

      // Filter the array based on the threshold, preserving the original order
      const filteredArray = posts.filter(obj =>
        obj.rating >= acceptableRange[0] && obj.rating <= acceptableRange[1]
      );

      // Take the first 10 items from the filtered array
      const top10Filtered = filteredArray.slice(0, 10);

      return JSON.stringify(top10Filtered);


    } catch (err) {
      throw new Error(err);
    }
  }
}

export async function getUser(userId) {
  await connectToDB();
  try {
    const user = await User.findById(userId).populate(
      "followers following",
    );
    if (!user) {
      throw new Error("cant find user");
    }
    return user;
  } catch (e) {
    throw new Error(`error occurred when trying to get user data: ${e}`);
  }
}

const { exec } = require('child_process'); //added
const util = require('util'); //added
const execAsync = util.promisify(exec); //added

export async function createNewPost(values) {
  const session = await getServerSession(authOptions);
  const validatedFields = formSchema.safeParse(values);
  if (validatedFields.success) {
    const { content, image } = validatedFields.data;

    // get the rating from ML using content and/or image
    const postsJson = JSON.stringify({ content: content, image: image })
    const { stdout, stderr } = await execAsync(`echo '${postsJson}' | python3 post_processing/post_processor.py`);//added

    if (stderr) {
      console.error("Error executing Python script: ${ stderr }");
      return JSON.stringify([]);
    }

    // Parse the JSON output from the Python script
    const processedJson = JSON.parse(stdout);
    // extract the rating
    const rating = Number(processedJson.rating);
    // create new post instance
    try {
      await connectToDB();
      // Create a new post instance
      const newPost = new Post({
        content,
        user: session.user.userId,
        image,
        rating: processedJson.rating,
      });



      const currentUser = await User.findById(session?.user.userId);

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


      return JSON.stringify(populatedPost); //commented out


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

export async function getUserPosts(userId, startId) {
  await connectToDB();
  const slider = await getSlider();
  const currentUser = await User.findById(userId);
  try {
    if (!startId) {
      const posts = await Post.find({ user: currentUser._id })
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
      // Determine thresholds or acceptance criteria based on the slider value
      let acceptableRange;
      if (slider < 20) {   // Seeking very liberal content
        acceptableRange = [0, 1];
      } else if (slider < 40) { // Seeking liberal content
        acceptableRange = [0, 2];
      } else if (slider < 60) { // Seeking neutral content
        acceptableRange = [1, 3];
      } else if (slider < 80) { // Seeking conservative content
        acceptableRange = [2, 4];
      } else {             // Seeking very conservative content
        acceptableRange = [3, 4];
      }

      // Filter the array based on the threshold, preserving the original order
      const filteredArray = posts.filter(obj =>
        obj.rating >= acceptableRange[0] && obj.rating <= acceptableRange[1]
      );

      // Take the first 10 items from the filtered array
      const top10Filtered = filteredArray.slice(0, 10);

      return JSON.stringify(top10Filtered);
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
      // Determine thresholds or acceptance criteria based on the slider value
      let acceptableRange;
      if (slider < 20) {   // Seeking very liberal content
        acceptableRange = [0, 1];
      } else if (slider < 40) { // Seeking liberal content
        acceptableRange = [0, 2];
      } else if (slider < 60) { // Seeking neutral content
        acceptableRange = [1, 3];
      } else if (slider < 80) { // Seeking conservative content
        acceptableRange = [2, 4];
      } else {             // Seeking very conservative content
        acceptableRange = [3, 4];
      }

      // Filter the array based on the threshold, preserving the original order
      const filteredArray = posts.filter(obj =>
        obj.rating >= acceptableRange[0] && obj.rating <= acceptableRange[1]
      );

      // Take the first 10 items from the filtered array
      const top10Filtered = filteredArray.slice(0, 10);

      return JSON.stringify(top10Filtered);
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Error fetching home feed: ${err}`);
  }
}

export async function updateProfile(userDetails) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.userId;
  const validatedFields = updateProfileSchema.safeParse(userDetails);
  if (validatedFields.success) {
    try {
      await connectToDB();
      const { name, url } = validatedFields.data;
      // name and pic both updated
      if (name && url) {
        const user = await User.findByIdAndUpdate(userId, {
          name: name,
          profilePicUrl: url,
        });
      }
      // only name is updated
      else if (!url) {
        const user = await User.findByIdAndUpdate(userId, { name: name });
      }
      // only url
      else {
        const user = await User.findByIdAndUpdate(userId, { profilePicUrl: url });

      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

export async function changeFollowings(otherUserId, isFollowing) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session.user.userId;
    await connectToDB();
    const sessionUser = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);
    // user is now following otherUser
    if (isFollowing) {
      sessionUser.following.push(otherUser._id);
      otherUser.followers.push(sessionUser._id);
    }
    else {
      // user is no longer following otherUser
      sessionUser.following.splice(
        sessionUser.following.indexOf(otherUser._id, 1),
      );
      otherUser.followers.splice(
        otherUser.followers.indexOf(sessionUser._id, 1),
      );
    }
    await sessionUser.save();
    await otherUser.save();
  }
  catch (err) {
    throw new Error(err);
  }
}