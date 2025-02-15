"use client";

import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import {
  EditorElement,
  useEditor,
} from "@/lib/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

interface IVideo {
  element: EditorElement;
}

const VideoComponent: React.FC<IVideo> = ({ element }) => {
  const { styles } = element;
  const { state, dispatch } = useEditor();

  const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleDeleteElement = () => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleOnDragStart(e, "video")}
      onClick={handleOnClick}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,
          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {!Array.isArray(element.content) && (
        <iframe
          width={element.styles.width || "560"}
          height={element.styles.height || "315"}
          src={element.content.src}
          title="Youtube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};
export default VideoComponent;
