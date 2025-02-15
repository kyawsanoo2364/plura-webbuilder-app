import Chip from "@/components/icons/chip";
import Notification from "@/components/icons/Notification";
import Payment from "@/components/icons/payment";
import Pipelines from "@/components/icons/PipelinesIcon";
import PluraCategory from "@/components/icons/pluraCategory";
import Tune from "@/components/icons/tune";
import Warning from "@/components/icons/warning";
import {
  BarChart2,
  Calendar,
  CheckCircle,
  CircleUser,
  ClipboardIcon,
  Compass,
  Database,
  Flag,
  Headphones,
  Home,
  Info,
  LinkIcon,
  Lock,
  MessageCircle,
  Power,
  Receipt,
  Send,
  Settings,
  Shield,
  Star,
  Video,
  Wallet,
} from "lucide-react";
import { EditorElement } from "./providers/editor/editor-provider";
import { v4 } from "uuid";

export const pricingCards = [
  {
    title: "Starter",
    description: "Perfect for trying out plura",
    price: "Free",
    duration: "",
    highlight: "Key features",
    features: ["3 Sub accounts", "2 Team members", "Unlimited pipelines"],
    priceId: "",
  },
  {
    title: "Unlimited Saas",
    description: "The ultimate agency kit",
    price: "$199",
    duration: "month",
    highlight: "Key features",
    features: ["Rebilling", "24/7 Support team"],
    priceId: "price_1Qq6E6IZoWrFz7tBFbYVpOQw",
  },
  {
    title: "Basic",
    description: "For serious agency owners",
    price: "$49",
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: ["Unlimited Sub accounts", "Unlimited Team members"],
    priceId: "price_1Qq6E6IZoWrFz7tBQDQGDzDx",
  },
];

export const addOnProducts = [
  { title: "Priority Support", id: "prod_RjZOmJQXI4jEaR" },
];

export const icons = [
  {
    value: "chart",
    label: "Bar Chart",
    path: BarChart2,
  },
  {
    value: "headphone",
    label: "Headphones",
    path: Headphones,
  },
  {
    value: "send",
    label: "Send",
    path: Send,
  },
  {
    value: "pipelines",
    label: "Pipelines",
    path: Pipelines,
  },
  {
    value: "calendar",
    label: "Calendar",
    path: Calendar,
  },
  {
    value: "settings",
    label: "Settings",
    path: Settings,
  },
  {
    value: "check",
    label: "Check Circled",
    path: CheckCircle,
  },
  {
    value: "chip",
    label: "Chip",
    path: Chip,
  },
  {
    value: "compass",
    label: "Compass",
    path: Compass,
  },
  {
    value: "database",
    label: "Database",
    path: Database,
  },
  {
    value: "flag",
    label: "Flag",
    path: Flag,
  },
  {
    value: "home",
    label: "Home",
    path: Home,
  },
  {
    value: "info",
    label: "Info",
    path: Info,
  },
  {
    value: "link",
    label: "Link",
    path: LinkIcon,
  },
  {
    value: "lock",
    label: "Lock",
    path: Lock,
  },
  {
    value: "messages",
    label: "Messages",
    path: MessageCircle,
  },
  {
    value: "notification",
    label: "Notification",
    path: Notification,
  },
  {
    value: "payment",
    label: "Payment",
    path: Payment,
  },
  {
    value: "power",
    label: "Power",
    path: Power,
  },
  {
    value: "receipt",
    label: "Receipt",
    path: Receipt,
  },
  {
    value: "shield",
    label: "Shield",
    path: Shield,
  },
  {
    value: "star",
    label: "Star",
    path: Star,
  },
  {
    value: "tune",
    label: "Tune",
    path: Tune,
  },
  {
    value: "videorecorder",
    label: "Video Recorder",
    path: Video,
  },
  {
    value: "wallet",
    label: "Wallet",
    path: Wallet,
  },
  {
    value: "warning",
    label: "Warning",
    path: Warning,
  },
  {
    value: "person",
    label: "Person",
    path: CircleUser,
  },
  {
    value: "category",
    label: "Category",
    path: PluraCategory,
  },
  {
    value: "clipboardIcon",
    label: "Clipboard Icon",
    path: ClipboardIcon,
  },
];

export type EditorBtns =
  | "text"
  | "container"
  | "section"
  | "contactForm"
  | "paymentForm"
  | "link"
  | "2Col"
  | "video"
  | "__body"
  | "image"
  | null
  | "3Col"
  | "copyEntireComponent";

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
};

export const OptimizeEditorContent = (
  content: EditorElement[]
): EditorElement[] => {
  return [
    ...content.map((el) => ({
      ...el,
      id: v4(),
      content:
        Array.isArray(el.content) && el.content.length > 0
          ? OptimizeEditorContent(el.content)
          : { ...el.content, id: v4() },
    })),
  ];
};
