"use client";

import { useModal } from "@/lib/providers/modal-provider";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../form/upload-media";

type Props = {
  subaccountId: string;
};

function MediaUploadButton({ subaccountId }: Props) {
  const { isOpen, setOpen, setClose } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm subaccountId={subaccountId} />
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
}
export default MediaUploadButton;
