import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getAllPosts, getUser } from "@/actions/actions";
import HomeFeed from "@/components/homefeed";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const sessionData = session?.user;
  const user = await getUser(sessionData.userId);
  const posts = await getAllPosts();
  const parsedPosts = JSON.parse(posts)
  
  return (
    <>
      <HomeFeed
        feedType={"all"}
        initialPosts={posts}
        authuserData={JSON.stringify(user)}
      />

    </>
  );
}
