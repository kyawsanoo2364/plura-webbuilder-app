import { getAuthUserDetails } from "@/lib/queries";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};
export default async function Sidbar({ id, type }: Props) {
  const user = await getAuthUserDetails();
  if (!user) return null;
  if (!user.Agency) return;

  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency.SubAccount.find((sub) => sub.id === id);
  const isWhiteLabelAgency = user.Agency.whiteLabel;

  if (!details) return;

  let sidebarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelAgency) {
    if (type === "subaccount") {
      sidebarLogo =
        user?.Agency.SubAccount.find((sub) => sub.id === id)?.subAccountLogo ||
        user?.Agency.agencyLogo;
    }
  }
  const sidebarOpt =
    type === "agency"
      ? user?.Agency.SidebarOption || []
      : user?.Agency.SubAccount.find((sub) => sub.id === id)?.SidebarOption ||
        [];

  const subAccounts = user?.Agency.SubAccount.filter((sub) =>
    user.Permissions.find(
      (permission) => permission.subAccountId === sub.id && permission.access
    )
  );

  return (
    <>
      <MenuOptions
        details={details}
        defaultOpen={true}
        id={id}
        subAccounts={subAccounts}
        sidebarOpt={sidebarOpt}
        user={user}
        sidebarLogo={sidebarLogo}
      />
      <MenuOptions
        details={details}
        id={id}
        subAccounts={subAccounts}
        sidebarOpt={sidebarOpt}
        user={user}
        sidebarLogo={sidebarLogo}
      />
    </>
  );
}
