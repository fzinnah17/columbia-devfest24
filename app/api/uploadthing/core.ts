import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = async () => {
  const session = await getServerSession(authOptions) as { user: { userId : string}};
  if (!session) throw new Error("Unauthorized");
  return { userId: session.user?.userId };
}

export const ourFileRouter = {
  newUserImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  authorizedImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;