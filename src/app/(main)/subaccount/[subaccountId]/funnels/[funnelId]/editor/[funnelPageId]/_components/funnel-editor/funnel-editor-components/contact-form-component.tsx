"use client";

import ContactForm from "@/components/form/contact-form";
import { ContactFormSchema } from "@/components/form/contact-user-form";
import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import {
  EditorElement,
  useEditor,
} from "@/lib/providers/editor/editor-provider";
import {
  getFunnel,
  saveActivityLogsNotification,
  upsertContact,
} from "@/lib/queries";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  element: EditorElement;
};
export default function ContactFormComponent({ element }: Props) {
  const { state, dispatch, funnelId, subaccountId, pageDetails } = useEditor();
  const router = useRouter();
  const { styles } = element;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleDeleteElement = () => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnel(funnelId);
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find(
        (page) => page.order === pageDetails.order + 1
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEMA}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const onFormSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
    if (!state.editor.liveMode) return;

    try {
      const response = await upsertContact({
        ...values,
        subAccountId: subaccountId,
      });
      await saveActivityLogsNotification({
        description: `A New Contact Signed up | ${response.name}`,
        subaccountId,
      });
      toast.success("Successfully Saved your info");
      await goToNextPage();
    } catch (error) {
      toast.error("Could not save your information.");
    }
  };

  return (
    <div
      draggable
      style={styles}
      onDragStart={(e) => handleOnDragStart(e, "contactForm")}
      onClick={handleOnClickBody}
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
      <ContactForm
        subTitle="Contact Us"
        title="Want a free quote? We can help you."
        apiCall={onFormSubmit}
      />
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
}
