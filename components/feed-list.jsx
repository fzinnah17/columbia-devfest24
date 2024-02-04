import { useSession } from "next-auth/react";
import { useState } from "react";
import PostCard from './feed-post-card';
import NewPostCard from './new-post-card';
import { getHomePosts, getUserPosts, getAllPosts } from "@/actions/actions";
import { Button } from "./ui/button";

export default function FeedList({
  posts,
  setPosts,
  postsLoading,
  authuserData,
  feedType,
  endOfFeed,
}) {
  const { data: session } = useSession();
  const [morePostsLoading, setMorePostsLoading] = useState(false);
  const [newEndOfFeed, setNewEndOfFeed] = useState(false);
    const parsedPosts = (typeof posts === 'string') ? JSON.parse(posts) : posts;

  // Fetch 10 of all posts startig from the last post id in the posts array
  const fetchMorePostsFromLastId = async () => {
    setMorePostsLoading(true);
    const startId = parsedPosts[parsedPosts.length - 1]._id;
    let res;
    let userId;
    switch (feedType) {
      case "all":
        res = await getAllPosts(startId);
        break;
      case "profile":
        res = await getUserPosts(session.user.userId, startId);
        break;
      case "user":
        userId = parsedPosts[0].user._id;
        // res = await getHomePosts(userId, startId);
        res = await getUserPosts(userId, startId);
        break;
      case "home":
        userId = parsedPosts[0].user._id;
        res = await getHomePosts(userId, startId);
        break;
    }
    const data = JSON.parse(res); // convert back
    if (data.length < 10) {
      setNewEndOfFeed(true);
    }
    setMorePostsLoading(false);
    setPosts(parsedPosts.concat(data));
  };
  if (postsLoading) {
    return null;
  }
  const allPosts = parsedPosts.map((postObj) => (
    <PostCard
      key={postObj._id}
      post={postObj}
      user={authuserData}
    />
  ));

    return (
    <div className="flex flex-col gap-6 items-center">


        {feedType !== "user" && <NewPostCard user={JSON.parse(authuserData)} />}
        <div className="text-2xl max-w-2xl relative w-full">
        {feedType === "user"
          ? `${JSON.parse(authuserData).username}'s posts`
          : feedType === "profile"
          ? "Your posts"
          : feedType === 'home'
          ? "Your feed" : "All posts"}
      </div>
        <div className="flex flex-col gap-10 items-center py-1 max-w-2xl w-full">
        {allPosts.length === 0 ? <>No posts yet...</> : <>{allPosts}</>}
      </div>
        {!newEndOfFeed && !endOfFeed ? (
          <div className="d-flex justify-content-center">
            {morePostsLoading ? (
              null
            ) : (
              <Button
                onClick={fetchMorePostsFromLastId}
              >
                Load posts
              </Button>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
}
