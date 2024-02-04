'use client';

import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormSuccess } from "./form-success";
import { Loader } from "lucide-react";
import { changeFollowings } from "@/actions/actions";
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";

export default function FriendCard({ user }) {
    const { toast } = useToast();

    const session = useSession();
    
    const [isFollowing, setIsFollowing] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (session.status !== 'loading') {
            setIsFollowing(JSON.parse(user).followers?.some(
                (id) => id === session?.data.user.userId));
        }
    }, [session, user])

    function handleClickProfilePic() {
          router.push(`/users/${JSON.parse(user)._id}`);
    }

        async function changeIsFollowing(bool) {
            try {
              await changeFollowings(JSON.parse(user)._id, bool);
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

    if (session.status === 'loading') return <Loader className="animate-spin m-auto" />

    
    return (
        <div className="flex justify-between items-center rounded-md p-4 border border-slate-400 dark:border-slate-800">
            <div className="flex gap-3 items-center">
                <Button variant="outline" size="circle" className="relative" onClick={handleClickProfilePic}>
                    <Image alt='profile' className="rounded-full" src={JSON.parse(user).profilePicUrl? JSON.parse(user).profilePicUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzykHG9uAxSMQWR-w0PL11LVzi2WD9IcXruJNMu0WMWQ&s'} fill />
                </Button >
            <span onClick={handleClickProfilePic} className="font-bold text-blue-500 cursor-pointer dark:text-blue-400">{JSON.parse(user).name}</span>
            </div>
            {isFollowing ? (
          <Button variant="destructive" className="self-end" onClick={() => changeIsFollowing(false)}>Unfollow</Button>
        ) : <Button className="self-end" onClick={() => changeIsFollowing(true)}>Follow</Button>}

        </div>
    )
}