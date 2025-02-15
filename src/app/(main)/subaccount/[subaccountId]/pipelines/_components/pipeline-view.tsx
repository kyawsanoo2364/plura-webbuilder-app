"use client";

import LaneForm from "@/components/form/lane-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  LaneDetail,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags,
} from "@/lib/types";
import { useModal } from "@/lib/providers/modal-provider";
import { Lane, Ticket } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import PipelineLane from "./pipeline-lane";

type Props = {
  lanes: LaneDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

const PipelineView = ({
  lanes,
  updateLanesOrder,
  updateTicketsOrder,
  pipelineDetails,
  pipelineId,
  subaccountId,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>();

  const ticketsFromAllLanes: TicketAndTags[] = [];
  lanes.forEach((item) => {
    item.Tickets.forEach((i) => {
      ticketsFromAllLanes.push(i);
    });
  });

  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const handleAddLane = async () => {
    setOpen(
      <CustomModal
        title="Create A Lane"
        subheading="Lanes allow you to group tickets"
      >
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    );
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;
    console.log(dropResult);
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    switch (type) {
      case "lane": {
        const newLane = [...allLanes]
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, allLanes[source.index])
          .map((lane, idx) => ({ ...lane, order: idx }));
        setAllLanes(newLane);
        updateLanesOrder(newLane);
      }
      case "ticket": {
        const newLanes = [...allLanes];
        const originalLane = newLanes.find(
          (lane) => lane.id === source.droppableId
        );
        const destinationLane = newLanes.find(
          (lane) => lane.id === destination.droppableId
        );
        if (!originalLane || !destinationLane) return;
        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originalLane.Tickets]
            .toSpliced(source.index, 1)
            .toSpliced(
              destination.index,
              0,
              originalLane.Tickets[source.index].map((i, idx) => ({
                ...i,
                order: idx,
              }))
            );
          originalLane.Tickets = newOrderedTickets;
          setAllLanes(newLanes);
          updateTicketsOrder(newOrderedTickets);
          router.refresh();
        } else {
          const [currentTicket] = originalLane.Tickets.splice(source.index, 1);
          originalLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });
          destinationLane.Tickets.splice(destination.index, 0, {
            ...currentTicket,
            laneId: destination.droppableId,
          });
          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });
          setAllLanes(newLanes);
          updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originalLane.Tickets,
          ]);
          router.refresh();
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button onClick={handleAddLane} className="flex item-center gap-4">
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key={"lanes"}
        >
          {(provided) => (
            <div
              className="flex items-center gap-x-2 overflow-scroll"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex mt-4">
                {allLanes?.map((lane, index) => (
                  <PipelineLane
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subaccountId={subaccountId}
                    pipelineId={pipelineId}
                    tickets={lane.Tickets}
                    laneDetail={lane}
                    index={index}
                    key={lane.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {allLanes?.length === 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100">
              <Flag
                width={"100%"}
                height={"100%"}
                className="text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
export default PipelineView;
