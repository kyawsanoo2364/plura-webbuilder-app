import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorBtns } from "@/lib/constants";
import React from "react";
import TextPlaceholder from "./text-placeholder";
import ContainerPlaceholder from "./container-placeholder";
import VideoPlaceholder from "./video-placeholder";
import LinkPlaceholder from "./link-placeholder";
import Col2Placeholder from "./2Col-placeholder";
import ContactFormPlaceholder from "./contact-form-placeholder";
import CheckoutPlaceholder from "./checkout-placeholder";

type Props = {};
const ComponentsTab = (props: Props) => {
  const elements: {
    Component: React.ReactNode;
    label: string;
    id: EditorBtns;
    group: "layout" | "elements";
  }[] = [
    {
      Component: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "elements",
    },
    {
      Component: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
    },
    {
      Component: <VideoPlaceholder />,
      label: "Video",
      id: "video",
      group: "elements",
    },
    {
      Component: <LinkPlaceholder />,
      label: "Link",
      id: "link",
      group: "elements",
    },
    {
      Component: <Col2Placeholder />,
      label: "2Col",
      id: "2Col",
      group: "layout",
    },
    {
      Component: <ContactFormPlaceholder />,
      label: "Contact Form",
      id: "contactForm",
      group: "elements",
    },
    {
      Component: <CheckoutPlaceholder />,
      label: "Checkout",
      id: "paymentForm",
      group: "elements",
    },
  ];

  return (
    <Accordion
      defaultValue={["Layout", "Elements"]}
      type="multiple"
      className="w-full"
    >
      <AccordionItem value="Layout" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {elements
            .filter((element) => element.group === "layout")
            .map((element) => (
              <div
                className="flex-col items-center justify-center flex"
                key={element.id}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Elements" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {elements
            .filter((element) => element.group === "elements")
            .map((element) => (
              <div
                className="flex-col items-center justify-center flex"
                key={element.id}
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default ComponentsTab;
