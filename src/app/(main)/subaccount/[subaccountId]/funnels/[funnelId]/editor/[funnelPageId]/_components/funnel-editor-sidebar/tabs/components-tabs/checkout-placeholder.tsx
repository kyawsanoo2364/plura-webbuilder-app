"use client";

import { EditorBtns } from "@/lib/constants";
import Image from "next/image";
import React from "react";

type Props = {};
const CheckoutPlaceholder = (props: Props) => {
  const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleOnDragStart(e, "paymentForm")}
      className="size-14 bg-muted rounded-lg rounded-t-lg flex items-center justify-center"
    >
      <Image
        src={"/stripelogo.png"}
        height={40}
        width={40}
        alt="Stripe Logo"
        className="object-cover"
      />
    </div>
  );
};
export default CheckoutPlaceholder;
