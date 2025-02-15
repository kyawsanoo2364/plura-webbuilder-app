import { db } from "@/lib/db";
import EditorProvider from "@/lib/providers/editor/editor-provider";
import { getDomainContent } from "@/lib/queries";
import { notFound } from "next/navigation";
import FunnelEditor from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";

async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const domainData = await getDomainContent(domain.slice(0, -1));
  if (!domainData) return notFound();

  const pageData = domainData.FunnelPages.find((page) => !page.pathName);
  if (!pageData) return notFound();

  await db.funnelPage.update({
    where: { id: pageData.id },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      funnelId={domainData.id}
      pageDetails={pageData}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
}
export default Page;
