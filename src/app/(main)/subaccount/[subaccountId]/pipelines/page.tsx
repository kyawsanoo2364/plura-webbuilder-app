import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const PipeLinesPage = async ({ params }: Props) => {
  const { subaccountId } = await params;
  const pipelineExits = await db.pipeline.findFirst({
    where: { subAccountId: subaccountId },
  });
  if (pipelineExits) {
    return redirect(
      `/subaccount/${subaccountId}/pipelines/${pipelineExits.id}`
    );
  }

  try {
    const response = await db.pipeline.create({
      data: { name: "First Pipeline", subAccountId: subaccountId },
    });
    return redirect(`/subaccount/${subaccountId}/pipelines/${response.id}`);
  } catch (error) {
    console.log(error);
  }
};
export default PipeLinesPage;
