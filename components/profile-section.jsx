"use client";

import { useSession } from "next-auth/react";
import EditProfile from './edit-profile';
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader } from "lucide-react";
import { changeFollowings } from "@/actions/actions";
import { useToast } from "./ui/use-toast";
import { FormSuccess } from "./form-success";

export default function ProfileSection({ edit, stringData }) {
  const { data: session, status } = useSession();
  const [userData, getUserData] = useState({});
  const [isFollowing, setIsFollowing] = useState(null);
  const [followsYou, setFollowsYou] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    if (userData === undefined || Object.keys(userData).length === 0) {
      getUserData(JSON.parse(stringData));
    }
      setIsFollowing(userData.followers?.some(
        (obj) => obj._id.toString() === session?.user.userId));
        console.log(userData)
        console.log(userData.following?.some(obj => obj._id.toString() === session?.user.userId));
    setFollowsYou(userData.following?.some(obj => obj._id.toString() === session?.user.userId));
  }, [stringData, userData, session]);


  async function changeIsFollowing(bool) {
    try {
      setIsLoading(true);
      await changeFollowings(userData._id, bool);
      setIsLoading(false);
      if (bool) {
        // user is now following this profile
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }

    }
    catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: err.message,
      })
    }
  }

  if (status === 'loading') return <Loader className="m-auto animate-spin" />

  return (
    <div className="flex justify-between items-center max-w-2xl w-full m-auto my-6">
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
      <div className="self-center flex flex-col gap-2">
        {edit ? <EditProfile /> : isFollowing ? (
          <Button variant="destructive" className="self-end" onClick={() => changeIsFollowing(false)}>Unfollow</Button>
        ) : <Button className="self-end" onClick={() => changeIsFollowing(true)}>Follow</Button>}
        {followsYou && <FormSuccess message={`${userData.username} is following you`} />}

      </div>
      
    </div>
  );
}
