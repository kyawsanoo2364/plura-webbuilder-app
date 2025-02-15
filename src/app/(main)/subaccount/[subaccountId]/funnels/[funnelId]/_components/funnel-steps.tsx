"use client";

import page from "@/app/(main)/agency/[agencyId]/page";
import CreateFunnelPage from "@/components/form/funnel-page";

import CustomModal from "@/components/global/custom-modal";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/lib/providers/modal-provider";
import { upsertFunnelPage } from "@/lib/queries";
import { FunnelsForSubAccount } from "@/lib/types";
import { FunnelPage } from "@prisma/client";
import { Check, ExternalLink, LucideEdit } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { toast } from "sonner";
import FunnelStepCard from "./funnel-step-card";

interface IFunnelSteps {
  funnel: FunnelsForSubAccount[0];
  subaccountId: string;
  pages: FunnelPage[];
  funnelId: string;
}

const FunnelSteps: React.FC<IFunnelSteps> = ({
  funnel,
  funnelId,
  pages,
  subaccountId,
}) => {
  const [clickedPage, setClickedPage] = useState<FunnelPage | undefined>(
    pages[0]
  );
  const [pagesState, setPagesState] = useState(pages);

  const onDragEnd = async (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx };
      });

    setPagesState(newPageOrder);
    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertFunnelPage(
          subaccountId,
          { id: page.id, order: index, name: page.name },
          funnelId
        );
      } catch (error) {
        console.log(error);
        toast.success("Could not save page order.");
      }
    });
  };

  const onDragStart = async (event: DragStart) => {
    const { droppableId } = event;
    const value = pagesState.find((p) => p.id === droppableId);
  };

  const { setOpen } = useModal();

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col ">
        <aside className="flex-[0.3] bg-background p-6 flex flex-col justify-between">
          <ScrollArea className="h-full">
            <div className="flex gap-4 items-center">
              <Check />
              Funnel Steps
            </div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable
                  droppableId="funnels"
                  direction="vertical"
                  key={"funnels"}
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div
                          key={page.id}
                          className="relative"
                          onClick={() => setClickedPage(page)}
                        >
                          <FunnelStepCard
                            funnelPage={page}
                            index={idx}
                            key={page.id}
                            activePage={page.id === clickedPage?.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No Pages
              </div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setOpen(
                <CustomModal
                  title="Create or Update a Funnel Page"
                  subheading="Funnel Pages allow you to create step by step processes for customers to follow "
                >
                  <CreateFunnelPage
                    subAccountId={subaccountId}
                    funnelId={funnelId}
                    order={pagesState.length}
                  />
                </CustomModal>
              );
            }}
          >
            Create New Step
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4">
          {pagesState.length ? (
            <Card className="h-full flex justify-between flex-col">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="border-2 rounded-lg sm:w-80 w-full overflow-clip">
                    <Link
                      href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                      className="relative group"
                    >
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className="text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                      />
                    </Link>
                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                      className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden overflow-ellipsis">
                        {process.env.NEXT_PUBLIC_SCHEMA}
                        {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                        {clickedPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <CreateFunnelPage
                    subAccountId={subaccountId}
                    defaultData={clickedPage}
                    funnelId={funnelId}
                    order={clickedPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground ">
              Create a page to view page settings
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  );
};
export default FunnelSteps;
