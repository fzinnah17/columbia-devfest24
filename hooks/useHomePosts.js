'use client';
import { useInfiniteQuery, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { getHomePosts } from '@/actions/actions';


import { Document, Schema } from 'mongoose';

// Define TypeScript types for the models
// interface IUser extends Document {
//   name: string;
//   username: string;
//   password?: string;
//   friends: Schema.Types.ObjectId[];
//   profilePicUrl?: string;
//   friendRequestsSent: Schema.Types.ObjectId[];
//   friendRequestsReceived: Schema.Types.ObjectId[];
//   posts: Schema.Types.ObjectId[];
// }

// interface IComment extends Document {
//   content: string;
//   user: IUser;
//   post: Schema.Types.ObjectId;
//   timestamp: Date;
// }

// interface ILike extends Document {
//   user: IUser;
//   post: Schema.Types.ObjectId;
//   timestamp: Date;
// }

// interface IPost extends Document {
//   content: string;
//   image?: string;
//   user: IUser;
//   timestamp: Date;
//   likes: ILike[];
//   comments: IComment[];
// }

// // Define the type for the return value of getHomePosts
// interface IGetHomePostsResponse {
//   posts: IPost[];
//   nextCursor: string | null;
// }

// // Define the type for the arguments of fetchPostsPage function
// interface IFetchPostsPageParams {
//   pageParam?: string;
//   userId: string;
// }

  const fetchPostsPage = async ({
    pageParam,
    userId,
  }) => {
    try {
        const res = (await getHomePosts(userId, pageParam));
      return res;
    } catch (err) {
      throw new Error(`error fetching home posts: ${err}`);
    }
  };

  export default function useHomePosts(userId) {
    return useInfiniteQuery({
      queryKey: ['homePosts', userId],
      queryFn: ({ pageParam }) => fetchPostsPage({ pageParam, userId }),
      getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ?? undefined,
    });
  }