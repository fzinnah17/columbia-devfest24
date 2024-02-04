"use client";

import { useEffect, useState } from "react";
import FeedList from "./feed-list";

import { useRouter } from "next/navigation";


// feedType: 'all' || 'home' || 'profile' || 'user'
export default function HomeFeed({ feedType, initialPosts, authuserData }) {
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


    
  return (
    <main className="w-full">
        <FeedList posts={posts} setPosts={setPosts} postsLoading={postsLoading} authuserData={authuserData} feedType={feedType} endOfFeed={endOfFeed} />
    </main>
  )
}
