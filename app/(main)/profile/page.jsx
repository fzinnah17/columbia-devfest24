import HomeFeed from "@/components/homefeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { getUserPosts, getUser } from "@/actions/actions";
import ProfileSection from '@/components/profile-section';

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = await getUser(session.user.userId);
  const posts = await getUserPosts(session.user.userId);
  return (
    <div className="mt-8 w-full">
    <ProfileSection stringData={JSON.stringify(user)} edit={true} />
    <HomeFeed
      feedType={"profile"}
      initialPosts={posts}
      authuserData={JSON.stringify(user)}
    />
  </div>
  );
};

export default Page;
