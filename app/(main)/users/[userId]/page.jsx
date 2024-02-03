import ProfileSection from "@/components/profile-section";
import HomeFeed from "@/components/homefeed";
import { getUser, getUserPosts } from "@/actions/actions";

export default async function UserPage({ params }) {
  const user = await getUser(params.userId);
  const posts = await getUserPosts(params.userId);
  return (
    <div className="mt-8 w-full">
      <ProfileSection stringData={JSON.stringify(user)} edit={false} />
      <HomeFeed
        feedType={"user"}
        initialPosts={posts}
        authuserData={JSON.stringify(user)}
      />
    </div>
  );
}
