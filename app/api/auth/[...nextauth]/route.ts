import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDB from "@/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { NextAuthOptions } from "next-auth";
import User from "@/models/User";


export const authOptions : NextAuthOptions = {
    pages: {
      signIn: '/',
      signOut: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          username: { label: "username", type: "text", placeholder: "username" },
          password: { label: "password", type: "password" },
        },
        // this will be called when we sign in with normal credentials
        async authorize(credentials) {
          const validatedFields = LoginSchema.safeParse(credentials);

          if (validatedFields.success) {
            await connectToDB();

            // authenticate the user
            const { username, password } = validatedFields.data;
            const regex = new RegExp(username, "i");
            const user = await User.findOne({ username: { $regex: regex } });
            if (!user) {
              throw new Error("Username does not exist");
            }
            const match = await bcrypt.compare(password, user.password);
          
            if (!match) {
              // passwords do not match
              throw new Error('Passwords not matching');
            }
            return user;
          }
          return null;

        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async signIn({ user, account } : any) : Promise<any> {
        // Google login: finding an existing account or creating a new account
        // in the database with the provided name, username and profilePicUrl provided by google
        if (account.provider === "google") {
          // user object has details from google account, use those details to retrieve or create user object
          // in api call later
          const credentials = {
            name: user.name,
            username: user.email,
            profilePicUrl: user.image,
          };
          // check if user with this google acc exists. Otherwise create new user based off google acc
          // attach database user id to user.id
          return true;
        } else if (account.provider === "credentials") {
          // we already have all the necessary data from authorize(), just return true
          return true;
        }
      },
      // transfer user data to token object
      // dont transfer anything that could be changed once the user has logged in
      async jwt({ token, user, account } : any) {
        if (account?.provider === "google") {
          //token.accessToken = user.token;
          // see what user is first
          token.name = user.name;
          token.username = user.email;
          token.profileImage = user.image;
          token.userId = user._id
        } else if (account?.provider === "credentials") {
          token.userId = user._id;
          token.username = user.username;
        }
        return token;
      },
      // transfer token data to session object
      async session({ session, token } : any) {
        session.user.userId = token.userId;
        session.user.username = token.username;
        // session only stores userId and username
        return session;
      },
    },
  };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };