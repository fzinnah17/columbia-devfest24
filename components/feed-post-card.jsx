"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import Comments from "./Comments";
import { postTimeStampDisplay } from "@/lib/utils";
// import DeletePostIcon from "./DeletePostIcon";

const PostCard = ({ post, user }) => {
//   const [postComments, setPostComments] = useState([]);

//   useEffect(() => {
//     // get initial comments on this post
//     const comments = post.comments;
//     comments.reverse(); // reverse to get most recent comments first
//     setPostComments(comments);
//   }, []);
  const parsedUser = JSON.parse(user);
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-md flex flex-col gap-4 max-w-2xl w-full">
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <Link
            href={
              post.user._id ===
              parsedUser._id
                ? "/profile"
                : `/users/${post.user._id}`
            }
          >
            <Image
              className="w-12 h-12 rounded-full"
              height={100}
              width={100}
              src={
                post.user.profilePicUrl
                  ? post.user.profilePicUrl
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzykHG9uAxSMQWR-w0PL11LVzi2WD9IcXruJNMu0WMWQ&s"
              }
              alt="User Profile"
            />
          </Link>
          <div className="text-sm space-y-1">
            <div className="font-bold text-base">
              <Link
                href={
                  post.user._id.toString() ===
                  JSON.parse(user)._id.toString()
                    ? "/profile"
                    : `/users/${post.user._id}`
                }
                className="dark:text-sky-400 dark:hover:text-sky-500 text-sky-600 hover:text-sky-700"
              >
                {post.user.name}
              </Link>
            </div>
            <div className="text-gray-500 dark:text-gray-300">
              {postTimeStampDisplay(post.timestamp)}
            </div>
          </div>
        </div>
        {/* <div>
          {post.user._id === JSON.parse(user)._id ? (
            <DeletePostIcon postId={post._id} />
          ) : null}
        </div> */}
      </div>
      <div className="mt-3 text-base text-gray-700 dark:text-gray-300 break-all">
        {post.content}
      </div>
      {post.image && <Image alt='post image' className="w-full" src={post.image} height={300} width={'300'} />}
      {/* <Comments
        postId={post._id}
        postComments={postComments}
        setPostComments={setPostComments}
        user={JSON.parse(user)}
      /> */}
    </div>
  );
};

export default PostCard;
