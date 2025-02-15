import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import {
  getLanesWithTicketAndTags,
  getPipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
} from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import PipelineInfobar from "../_components/pipeline-infobar";
import PipelineSettings from "../_components/pipeline-settings";
import PipelineView from "../_components/pipeline-view";

type Props = {
  params: Promise<{ subaccountId: string; pipelineId: string }>;
};

const PipelinePage = async ({ params }: Props) => {
  const { subaccountId, pipelineId } = await params;
  const pipelineDetails = await getPipelineDetails(pipelineId);

  if (!pipelineDetails) {
    return redirect(`/subaccount/${subaccountId}/pipelines`);
  }

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(pipelineId)) as LaneDetail[];

  return (
    <Tabs className="w-full" defaultValue="view">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfobar
          pipelineId={pipelineId}
          subaccountId={subaccountId}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={pipelineId}
          subaccountId={subaccountId}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={pipelineId}
          pipelines={pipelines}
          subaccountId={subaccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

//7:07
export default PipelinePage;
