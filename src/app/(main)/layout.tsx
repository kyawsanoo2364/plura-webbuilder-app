import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { dark } from "@clerk/themes";

import { connection } from "next/server";
import { Suspense } from "react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider dynamic appearance={{ baseTheme: dark }}>
      <Suspense fallback={<div>Uploadthing Error!</div>}>
        <UTSSR />
      </Suspense>
      {children}
    </ClerkProvider>
  );
}
