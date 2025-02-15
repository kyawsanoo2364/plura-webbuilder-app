import { EditorElement } from "@/lib/providers/editor/editor-provider";
import TextComponent from "./text";
import Container from "./container";
import VideoComponent from "./video";
import LinkComponent from "./link";
import ContactFormComponent from "./contact-form-component";
import CheckoutComponent from "./checkout";

type Props = {
  element: EditorElement;
};
const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "__body":
      return <Container element={element} />;
    case "2Col":
      return <Container element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    case "paymentForm":
      return <CheckoutComponent element={element} />;
    default:
      return null;
  }
};
export default Recursive;
