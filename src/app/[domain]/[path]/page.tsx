import FunnelEditor from "@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import EditorProvider from "@/lib/providers/editor/editor-provider";
import { getDomainContent } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string; path: string }>;
}) {
  const { domain, path } = await params;
  const domainData = await getDomainContent(domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === path
  );
  if (!domainData || !pageData) return notFound();
  return (
    <EditorProvider
      funnelId={domainData.id}
      pageDetails={pageData}
      subaccountId={domainData.subAccountId}
    >
      <FunnelEditor liveMode funnelPageId={pageData.id} />
    </EditorProvider>
  );
}
