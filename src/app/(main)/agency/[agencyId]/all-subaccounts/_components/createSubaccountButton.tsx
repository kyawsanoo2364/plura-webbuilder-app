"use client";

import SubAccountDetails from "@/components/form/subaccount-details";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/lib/providers/modal-provider";
import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  Subscription,
  User,
} from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
              Subscription: Subscription;
            })
        )
      | null;
  };
  id: string;
  className: string;
};

const CreateSubaccountButton = ({ user, id, className }: Props) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;
  if (!agencyDetails) return null;

  return (
    <Button
      className={twMerge("w-full flex gap-4", className)}
      onClick={() => {
        if (!agencyDetails?.Subscription?.active) {
          if (agencyDetails?.SubAccount.length >= 3) {
            toast.error(
              "You can't more than 3 subaccount. Please consider to use plan or upgrade."
            );
            return;
          }
        }
        setOpen(
          <CustomModal
            title="Create a Subaccount"
            subheading="You can switch between"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create a Subaccount
    </Button>
  );
};
export default CreateSubaccountButton;
