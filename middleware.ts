import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/',
    signOut: '/',
  },
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!register|api|logo.png|$).*)"]
};
