import SubAccountDetails from "@/components/form/subaccount-details";
import UserDetails from "@/components/form/user-details";
import BlurPage from "@/components/global/blur-page";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const SubaccountSettingsPage: React.FC<Props> = async ({ params }) => {
  const { subaccountId } = await params;
  const authUser = await currentUser();
  if (!authUser) return;

  const userDetails = await db.user.findUnique({
    where: { email: authUser.emailAddresses[0].emailAddress },
  });
  if (!userDetails) return;
  const subAccount = await db.subAccount.findUnique({
    where: { id: subaccountId },
  });

  if (!subAccount) return null;
  const agencyDetails = await db.agency.findUnique({
    where: { id: subAccount.agencyId },
    include: { SubAccount: true },
  });
  if (!agencyDetails) return null;
  const subAccounts = agencyDetails.SubAccount;

  return (
    <BlurPage>
      <div className="flex lg:flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="subaccount"
          subAccounts={subAccounts}
          userData={userDetails}
          id={subaccountId}
        />
      </div>
    </BlurPage>
  );
};
export default SubaccountSettingsPage;
