"use client";

import CreatePipelineForm from "@/components/form/createpipeline-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useModal } from "@/lib/providers/modal-provider";
import { Pipeline } from "@prisma/client";
import { Check, ChevronDown, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  subaccountId: string;
  pipelines: Pipeline[];
  pipelineId: string;
};
const PipelineInfobar = ({ subaccountId, pipelineId, pipelines }: Props) => {
  const { setOpen: setOpenModal, setClose } = useModal();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pipelineId);

  const handleClickCreatePipeline = () => {
    setOpenModal(
      <CustomModal
        title="Create A Pipeline"
        subheading="Pipelines allows you to group tickets into lanes and track your business processes all in the place."
      >
        <CreatePipelineForm subAccountId={subaccountId} />
      </CustomModal>
    );
  };

  return (
    <div>
      <div className="flex items-end gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between "
            >
              {value
                ? pipelines.find((pipeline) => pipeline.id === pipelineId)?.name
                : "Select a pipeline...."}
              <ChevronsUpDown className="ml-2 w-4 h-4 flex-shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandEmpty>No pipelines found</CommandEmpty>
              <CommandGroup>
                {pipelines.map((pipeline) => (
                  <Link
                    key={pipeline.id}
                    href={`/subaccount/${subaccountId}/pipelines/${pipeline.id}`}
                  >
                    <CommandItem
                      key={pipeline.id}
                      value={pipeline.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value === pipeline.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {pipeline.name}
                    </CommandItem>
                  </Link>
                ))}
                <Button
                  variant={"secondary"}
                  className="flex gap-2 w-full mt-4"
                  onClick={handleClickCreatePipeline}
                >
                  <Plus size={15} />
                  Create Pipeline
                </Button>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
export default PipelineInfobar;
