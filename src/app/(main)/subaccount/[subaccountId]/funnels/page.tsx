import BlurPage from "@/components/global/blur-page";
import { Plus } from "lucide-react";
import React from "react";
import FunnelsDataTable from "./data-table";
import { columns } from "./columns";
import { getFunnels } from "@/lib/queries";
import CreateFunnel from "@/components/form/funnel-form";

interface IFunnelsPage {
  params: Promise<{ subaccountId: string }>;
}

const FunnelsPage: React.FC<IFunnelsPage> = async ({ params }) => {
  const { subaccountId } = await params;
  const funnels = await getFunnels(subaccountId);
  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} /> Create Funnel
          </>
        }
        modalChildren={
          <CreateFunnel subAccountId={subaccountId}></CreateFunnel>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};
export default FunnelsPage;
