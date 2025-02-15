"use client";

import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import {
  EditorElement,
  useEditor,
} from "@/lib/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ILinkComponent {
  element: EditorElement;
}

const LinkComponent: React.FC<ILinkComponent> = ({ element }) => {
  const { styles } = element;
  const { state, dispatch } = useEditor();

  const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
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
      onDragStart={(e) => handleOnDragStart(e, "link")}
      onClick={handleOnClickBody}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] trasition-all",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,
          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <>
            <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
              {state.editor.selectedElement.name}
            </Badge>
          </>
        )}
      {!Array.isArray(element.content) &&
        (state.editor.previewMode || state.editor.liveMode) && (
          <Link href={element.content.href || "#"}>
            {element.content.innerText}
          </Link>
        )}
      {!state.editor.previewMode && !state.editor.liveMode && (
        <span
          contentEditable={!state.editor.liveMode}
          onBlur={(e) => {
            const spanElement = e.target as HTMLSpanElement;
            dispatch({
              type: "UPDATE_ELEMENT",
              payload: {
                elementDetails: {
                  ...element,
                  content: {
                    innerText: spanElement.innerText,
                  },
                },
              },
            });
          }}
        >
          {!Array.isArray(element.content) && element.content.innerText}
        </span>
      )}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2 5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};
export default LinkComponent;
