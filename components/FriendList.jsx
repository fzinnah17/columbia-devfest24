import FriendCard from "./FriendCard";

export default async function FriendList({ users, heading }) {
    let arr;
    if (users.length > 0) {
      arr = users.map((user) => <FriendCard key={user._id} user={JSON.stringify(user)} />);
    }
    return (
        <div className="flex flex-col p-10 gap-2">
            <h1 className="font-bold text-2xl">{heading}</h1>
            {arr}
        </div>
    )
}