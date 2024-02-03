import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";

import { NextResponse } from "next/server";
import connectToDB from "@/db";

// gets user data given userId param
export async function GET(req, context) {
  await connectToDB();
  const userId = context.params.userId;

  const currentUser = await User.findById(userId);
  // this is how we check what to show on feed
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  // get all posts in feed
  const usersIds = [currentUser._id, ...currentUser.friends];
  try {
    if (!startId) {
        const posts = await Post.find({ user: { $in: usersIds } })
          .sort({ _id: -1 })
          .populate("user")
          .populate({
            path: "comments",
            populate: {
              path: "user",
            },
          });
        // input posts in ML api. It will return all home feed posts that align with your 
        // slider. 
        return NextResponse.json({ posts });

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
        // the prev batch, all aligning with your slider. If there are 11 posts, nextCursor 
        // is 10th post's id, else dont return cursor
        return NextResponse.json({ posts });

    }
  } catch (err) {
    console.log(err);
    throw new Error(`Error fetching home feed: ${err}`);
  }
  }
