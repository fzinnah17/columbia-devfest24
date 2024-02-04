import HomeFeed from "@/components/homefeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { getHomePosts, getUser } from "@/actions/actions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const sessionData = session?.user;
  const user = await getUser(sessionData.userId);
  const posts = await getHomePosts(sessionData.userId);
  console.log(JSON.parse(posts))
  return (
    <>
      <HomeFeed
        feedType={"home"}
        initialPosts={posts}
        authuserData={JSON.stringify(user)}
      />

    </>
  );
}
