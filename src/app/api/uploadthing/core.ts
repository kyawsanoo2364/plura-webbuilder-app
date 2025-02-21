import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticateUser = async () => {
  const user = await auth();
  // If you throw, the user will not be able to upload

  if (!user) throw new Error("Unauthorized");
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId: user.userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)

    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
