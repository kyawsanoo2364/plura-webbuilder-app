import { db } from "@/lib/db";
import EditorProvider from "@/lib/providers/editor/editor-provider";
import { redirect } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "./_components/funnel-editor-nav";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import FunnelEditor from "./_components/funnel-editor";

interface Props {
  params: Promise<{
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  }>;
}

const Page: React.FC<Props> = async ({ params }) => {
  const { subaccountId, funnelId, funnelPageId } = await params;

  const funnelPageDetails = await db.funnelPage.findFirst({
    where: { id: funnelPageId },
  });
  if (!funnelPageDetails) {
    return redirect(`/subaccount/${subaccountId}/funnels/${funnelId}`);
  }

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          subaccountId={subaccountId}
          funnelPageDetails={funnelPageDetails}
          funnelId={funnelId}
        />
        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageId={funnelPageId} />
        </div>
        <FunnelEditorSidebar subaccountId={subaccountId} />
      </EditorProvider>
    </div>
  );
};
export default Page;
