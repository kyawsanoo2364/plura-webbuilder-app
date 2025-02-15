import AgencyDetails from "@/components/form/agency-details";
import UserDetails from "@/components/form/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{ agencyId: string }>;
};

const SettingPage = async ({ params }: Props) => {
  const agencyId = (await params).agencyId;
  const authUser = await currentUser();
  if (!authUser) return null;

  const user = await db.user.findUnique({
    where: { email: authUser.emailAddresses[0].emailAddress },
  });
  if (!user) return null;

  const agencyDetails = await db.agency.findUnique({
    where: { id: agencyId },
    include: {
      SubAccount: true,
    },
  });
  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails
        type="agency"
        id={agencyId}
        subAccounts={subAccounts}
        userData={user}
      />
    </div>
  );
};
export default SettingPage;
