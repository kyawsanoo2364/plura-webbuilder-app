import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploading";

type Props = {
  apiEndPoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};
const FileUploading = ({ apiEndPoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative size-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button
          variant={"ghost"}
          type="button"
          className=""
          onClick={() => onChange("")}
        >
          <X className="size-4" />
          Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndPoint}
        onClientUploadComplete={(res) => {
          console.log("Uplodthing File : " + res);
          onChange(res[0].url);
        }}
        onUploadError={(err) => {
          console.log(err);
          alert(err.message);
        }}
      />
    </div>
  );
};
export default FileUploading;
