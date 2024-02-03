import HomeFeed from "@/components/homefeed";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import connectToDB from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getHomePosts, getUser } from "@/actions/actions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const sessionData = session?.user as {name: string; userId: string; username: string};
  const user = await getUser(sessionData.userId);
  const posts = await getHomePosts(sessionData.userId);
  return (
    <>
      <HomeFeed
        feedType={"home"}
        initialPosts={JSON.stringify(posts)}
        authuserData={JSON.stringify(user)}
      />

    </>
  );
}
