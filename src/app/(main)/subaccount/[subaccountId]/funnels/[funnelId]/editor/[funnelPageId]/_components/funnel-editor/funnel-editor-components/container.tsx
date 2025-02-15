"use client";

import { Badge } from "@/components/ui/badge";
import {
  defaultStyles,
  EditorBtns,
  OptimizeEditorContent,
} from "@/lib/constants";
import {
  EditorElement,
  useEditor,
} from "@/lib/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import { v4 } from "uuid";
import Recursive from "./recursive";
import { Trash } from "lucide-react";

type Props = {
  element: EditorElement;
};
const Container = ({ element }: Props) => {
  const { id, styles, name, content, type } = element;
  const { state, dispatch } = useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              name: "Text",
              content: { innerText: "Text Element" },
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              name: "Container",
              content: [],
              styles: {
                ...defaultStyles,
              },
              type: "container",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              name: "2Col",
              content: [
                {
                  content: [],
                  id: v4(),
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  name: "Container",
                },
                {
                  content: [],
                  id: v4(),
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  name: "Container",
                },
              ],
              styles: {
                ...defaultStyles,
              },
              type: "2Col",
            },
          },
        });
        break;
      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              content: [],
              name: "Contact Form",
              type: "contactForm",
              styles: {},
            },
          },
        });
        break;
      case "paymentForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              content: [],
              name: "Contact Form",
              type: "paymentForm",
              styles: {},
            },
          },
        });
        break;
      case "video":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.youtube.com/embed/T0mzbAQFcqQ?si=ELsTHOc0qJsUSJDD",
              },
              id: v4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });
        break;
      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              content: {
                innerText: "Link Element",
                href: "#",
              },
              name: "Link",
              type: "link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
            },
          },
        });
        break;
      case "copyEntireComponent":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              id: v4(),
              type: "container",
              content: OptimizeEditorContent(
                state.editor.selectedElement.content as EditorElement[]
              ),
              name: "Container",
              styles: { ...state.editor.selectedElement.styles },
            },
          },
        });
        break;
      default:
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    if (
      Array.isArray(state.editor.selectedElement.content) &&
      state.editor.selectedElement.content?.length > 0
    ) {
      e.dataTransfer.setData("componentType", "copyEntireComponent");
    } else {
      e.dataTransfer.setData("componentType", type);
    }
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
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-scroll": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "!border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onDragStart={(e) => handleDragStart(e, "container")}
      onClick={handleOnClickBody}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>
      {Array.isArray(element.content) &&
        element.content?.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};
export default Container;
