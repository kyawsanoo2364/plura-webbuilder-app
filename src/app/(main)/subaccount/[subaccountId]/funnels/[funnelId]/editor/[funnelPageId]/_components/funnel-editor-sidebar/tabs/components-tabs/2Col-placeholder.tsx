import { EditorBtns } from "@/lib/constants";
import { Columns2 } from "lucide-react";
import React from "react";

const Col2Placeholder = () => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (!type) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, "2Col")}
      className="size-14 bg-muted/70 rounded-lg p-2 flex flex-row items-center justify-center text-xs gap-[4px]"
    >
      <Columns2 className="text-muted-foreground" size={40} />
    </div>
  );
};
export default Col2Placeholder;
