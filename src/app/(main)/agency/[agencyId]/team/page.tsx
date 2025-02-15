import { db } from "@/lib/db";
import DataTable from "./data-table";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import { columns } from "./column";
import SendInvitation from "@/components/form/send-invitation";

type Props = {
  params: Promise<{ agencyId: string }>;
};

const page = async ({ params }: Props) => {
  const { agencyId } = await params;
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: { agencyId: agencyId },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: { id: agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  );
};
export default page;
