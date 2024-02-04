import User from "@/models/User";
import connectToDB from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";

import FriendList from "@/components/FriendList";

async function getUsersFromFilter(filter, userId) {
  const regex = new RegExp(`^${filter}`, "i"); // 'i' makes the search case-insensitive
  const names = await User.find({ name: regex, _id: { $ne: userId } });
  const usernames = await User.find({ username: regex, _id: { $ne: userId } });
  const res = [...names];
  const seenIds = new Set(names.map((obj) => obj._id.toString()));
  // make sure there are no duplicate users
  for (const obj of usernames) {
    if (!seenIds.has(obj._id.toString())) {
      seenIds.add(obj._id.toString());
      res.push(obj);
    }
  }
  return res;
}

export default async function Search({ searchParams }) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const users = await getUsersFromFilter(searchParams.filter, userId);
  return (
    <>
        <FriendList users={users} heading={`Results for "${searchParams.filter}"`} />
    </>
  );
}