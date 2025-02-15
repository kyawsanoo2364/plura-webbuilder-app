"use client";

import ContactUserForm from "@/components/form/contact-user-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/lib/providers/modal-provider";
import React from "react";

interface ICreateContactButton {
  subAccountId: string;
}

const CreateContactButton: React.FC<ICreateContactButton> = ({
  subAccountId,
}) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact Information"
        subheading="Contacts are like customers"
      >
        <ContactUserForm subaccountId={subAccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};
export default CreateContactButton;
