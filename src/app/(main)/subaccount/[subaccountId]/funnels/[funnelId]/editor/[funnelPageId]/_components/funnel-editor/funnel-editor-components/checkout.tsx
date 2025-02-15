"use client";

import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import {
  EditorElement,
  useEditor,
} from "@/lib/providers/editor/editor-provider";
import {
  getFunnel,
  getFunnelPageDetails,
  getSubaccountDetails,
} from "@/lib/queries";
import { getStripe } from "@/lib/stripe/stripe-client";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import clsx from "clsx";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  element: EditorElement;
};
const CheckoutComponent = ({ element }: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [livePrices, setLivePrices] = useState("");
  const [subaccountConnectAccId, setSubaccountConnectAccId] = useState("");

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  useEffect(() => {
    const fetchData = async () => {
      if (!subaccountId) return;
      const subaccountDetails = await getSubaccountDetails(subaccountId);
      if (subaccountDetails) {
        if (!subaccountDetails.connectAccountId) return;
        setSubaccountConnectAccId(subaccountDetails.connectAccountId);
      }
    };
    fetchData();
  }, [subaccountId]);

  useEffect(() => {
    if (funnelId) {
      const fetchData = async () => {
        const funnelData = await getFunnel(funnelId);
        setLivePrices(JSON.parse(funnelData?.liveProducts || "[]"));
      };
      fetchData();
    }
  }, [funnelId]);

  useEffect(() => {
    if (livePrices.length && subaccountId && subaccountConnectAccId) {
      const getClientSecret = async () => {
        try {
          const body = JSON.stringify({
            subaccountConnectAccId,
            prices: livePrices,
            subaccountId,
          });
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/stripe/create-checkout-session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
            }
          );
          const responseJson = await response.json();
          if (!responseJson) throw new Error("Something went wrong");
          if (responseJson.error) throw new Error(responseJson.error);
          if (responseJson.clientSecret) {
            setClientSecret(responseJson.clientSecret);
          }
        } catch (error) {
          toast.error(`Opps! ${error.message}`);
        }
      };

      getClientSecret();
    }
  }, [livePrices, subaccountConnectAccId, subaccountId]);

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

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPage = await getFunnel(funnelId);
    if (!funnelPage || !pageDetails) return;
    if (funnelPage.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPage.FunnelPages.find(
        (p) => p.order === pageDetails.order + 1
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEMA}${funnelPage.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const handleDeleteElement = () => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  return (
    <div
      draggable
      style={element.styles}
      onDragStart={(e) => handleOnDragStart(e, "paymentForm")}
      onClick={handleOnClickBody}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center ",
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
            <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
              <Trash
                size={16}
                onClick={handleDeleteElement}
                className="cursor-pointer"
              />
            </div>
          </>
        )}
      <div className="border-none transition-all w-full">
        <div className="flex flex-col gap-4 w-full">
          {options.clientSecret && subaccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider
                stripe={getStripe(subaccountConnectAccId)}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
          {!options.clientSecret && (
            <div className="flex items-center justify-center w-full h-40">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CheckoutComponent;
