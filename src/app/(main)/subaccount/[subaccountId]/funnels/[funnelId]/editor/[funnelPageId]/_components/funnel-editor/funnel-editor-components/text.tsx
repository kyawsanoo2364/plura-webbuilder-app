"use client";

import { Badge } from "@/components/ui/badge";
import {
  EditorElement,
  useEditor,
} from "@/lib/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

interface ITextComponent {
  element: EditorElement;
}

const TextComponent: React.FC<ITextComponent> = ({ element }) => {
  const { state, dispatch } = useEditor();

  const handleDeleteElement = () => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const styles = element.styles;

  return (
    <div
      style={styles}
      draggable
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
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
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
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
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
export default TextComponent;
