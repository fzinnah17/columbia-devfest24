import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createUploadthing } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return { userId: session.user?.userId };
}

export const ourFileRouter = {
  newUserImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  authorizedImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
};
 