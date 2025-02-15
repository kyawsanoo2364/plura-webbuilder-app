import { EditorBtns } from "@/lib/constants";
import { Youtube } from "lucide-react";
import React from "react";

const VideoPlaceholder = () => {
  const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleOnDragStart(e, "video")}
      className="size-14 bg-muted rounded-lg flex item-center justify-center"
    >
      <Youtube size={40} className="text-muted-foreground" />
    </div>
  );
};
export default VideoPlaceholder;
