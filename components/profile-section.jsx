"use client";

import { useSession } from "next-auth/react";
import EditProfile from './edit-profile';
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader } from "lucide-react";

export default function ProfileSection({ edit, stringData }) {
  const { data: session, status } = useSession();
  const [userData, getUserData] = useState({});
  const [friendRequestStatus, setFriendRequestStatus] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick(accepted) {
    setIsLoading(true);
    let res;
    if (accepted) {
      res = await fetch(`/api/friend-requests/${userData._id}/accept`, {
        method: "POST",
      });
      setFriendRequestStatus("friends");
    } else {
      res = await fetch(`/api/friend-requests/${userData._id}/decline`, {
        method: "POST",
      });
    }
    if (res.status === 200) {
      location.reload();
    } else {
      setError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (userData === undefined || Object.keys(userData).length === 0) {
      getUserData(JSON.parse(stringData));
    }
    if (
      userData.friendRequestsReceived?.some(
        (obj) => obj._id.toString() === session?.user.userId,
      )
    ) {
      setFriendRequestStatus("sent");
    } else if (
      userData.friends?.some(
        (obj) => obj._id.toString() === session?.user.userId,
      )
    ) {
      setFriendRequestStatus("friends");
    }
    // this user has sent you a FR
    else if (
      userData.friendRequestsSent?.some(
        (obj) => obj._id.toString() === session?.user.userId,
      )
    ) {
      setFriendRequestStatus("received");
    }
  }, [stringData, userData, session]);

  async function handleUnfriendClick() {
    setIsLoading(true);
    const res = await fetch(`/api/users/${userData._id}/unfriend`, {
      method: "DELETE",
    });
    if (res.status === 200) {
      setFriendRequestStatus("none");
      location.reload();
    } else {
      setError(true);
    }
    setIsLoading(false);
  }

  async function handleSendFriendRequest() {
    const status = friendRequestStatus;
    setIsLoading(true);
    // send the request
    if (status === "none" || status === "error") {
      const res = await fetch(`/api/friend-requests`, {
        method: "POST",
        body: JSON.stringify({ friendId: userData._id }),
      });
      if (res.status === 200) {
        setFriendRequestStatus("sent");
      } else {
        setFriendRequestStatus("error");
      }
    }
    // cancel request
    else {
      const res = await fetch(`/api/friend-requests/${userData._id}/cancel`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        setFriendRequestStatus("none");
      } else {
        setFriendRequestStatus("error");
      }
    }
    setIsLoading(false);
  }

  if (status === 'loading') return <Loader className="m-auto animate-spin" />

  return (
    <div className="flex justify-between items-center max-w-2xl w-full m-auto">
      <div className="flex gap-4">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={
              userData.profilePicUrl?.length > 0
                ? userData.profilePicUrl
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzykHG9uAxSMQWR-w0PL11LVzi2WD9IcXruJNMu0WMWQ&s"
            }
            alt='profile'
            className="rounded-full"
            fill
          />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <span className="font-bold text-4xl">{userData.name}</span>
          <span>@{userData.username}</span>
        </div>
      </div>
      <div className="self-center">
        {!edit && friendRequestStatus !== "received" && (
          <div className="col mt-auto">
            {friendRequestStatus !== "friends" && (
              <Button
                type="button"
                onClick={handleSendFriendRequest}
              >
                {friendRequestStatus === "sent" ? (
                  "Pending"
                ) : friendRequestStatus === "none" ||
                  friendRequestStatus === "error" ? (
                  "Send Friend Request"
                ) : (
                  <div>
                    <div>loader icon</div>
                  </div>
                )}
              </Button>
            )}
          </div>
        )}
        {friendRequestStatus === "received" && (
          <>
            <Button
              variant={'destructive'}
              onClick={() => handleClick(false)}
            >
              Decline
            </Button>
            <Button
              variant={'default'}
              onClick={() => handleClick(true)}
            >
              Accept
            </Button>
          </>
      )}
      {friendRequestStatus === "friends" && (
          <Button onClick={() => handleUnfriendClick()}>
            {/* make this an alert if have time */}
            Unfriend
            </Button>
      )}
      {friendRequestStatus === "error" && (
        <div className="alert alert-danger px-3 py-2" role="alert">
          Error. Please try again later.
        </div>
      )}
        {edit && <EditProfile />}
      </div>
    </div>
  );
}
