"use client";

import CreatePipelineForm from "@/components/form/createpipeline-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePipeline, saveActivityLogsNotification } from "@/lib/queries";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
};
const PipelineSettings = ({ pipelineId, pipelines, subaccountId }: Props) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are your absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permently delete your
                account and remove your data from our servers .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const res = await deletePipeline(pipelineId);
                    await saveActivityLogsNotification({
                      description: `Deleted Pipeline | ${res.name}`,
                      subaccountId: subaccountId,
                    });
                    toast.success("Pipeline is deleted");
                    router.replace(`/subaccount/${subaccountId}/pipelines`);
                  } catch (error) {
                    console.log(error);
                    toast.error("Opps! Could not delete pipeline");
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
        <CreatePipelineForm
          subAccountId={subaccountId}
          defaultData={pipelines?.find((p) => p.id === pipelineId)}
        />
      </div>
    </AlertDialog>
  );
};
export default PipelineSettings;
