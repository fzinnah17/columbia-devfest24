"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import NewPostCard from "./NewPostCard";
// import FeedList from "./FeedList";
// import useHomePosts from "@/hooks/useHomePosts";
import { createNewPost } from "@/actions/actions";
import FeedList from "./feed-list";

import { useRouter } from "next/navigation";


type HomeFeedProps = {
    feedType : 'all' | 'home' | 'profile' | 'user';
    initialPosts: string;
    authuserData: string;
}

// feedType: 'all' || 'home' || 'profile' || 'user'
export default function HomeFeed({ feedType, initialPosts, authuserData } : HomeFeedProps) {
    const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [endOfFeed, setEndOfFeed] = useState(false);
    const [postsLoading, setPostsLoading] = useState(true);

    useEffect(() => {
        async function getPosts() {
          setPostsLoading(true);
          const parsedPosts = JSON.parse(initialPosts);
          if (parsedPosts.length < 10) {
            setEndOfFeed(true);
          }
          setPosts(parsedPosts);
          setPostsLoading(false);
        }
        getPosts();
      }, [initialPosts]);


    
    // const displayedPosts = posts.map((post, ind) => <div key={ind}>{post.content} made by {post.user.username}</div>)
    // console.log(typeof posts)
  return (
    <main className="w-full">
        <FeedList posts={posts} setPosts={setPosts} postsLoading={postsLoading} authuserData={authuserData} feedType={feedType} endOfFeed={endOfFeed} />
    </main>
  )
}
