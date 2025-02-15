import Unauthorized from "@/components/unauthorized";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";

type Props = {
  children: ReactNode;
  params: Promise<{ agencyId: string }>;
};
export default async function Layout({ children, params }: Props) {
  const paramsAgencyId = (await params).agencyId;
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();
  if (!user) return redirect("/");
  if (!agencyId) return redirect("/agency");

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

  let allNoti = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={paramsAgencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={allNoti?.User?.role} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
}
