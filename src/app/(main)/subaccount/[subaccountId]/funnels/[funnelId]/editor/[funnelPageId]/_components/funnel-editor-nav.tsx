"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeviceTypes, useEditor } from "@/lib/providers/editor/editor-provider";
import { saveActivityLogsNotification, upsertFunnelPage } from "@/lib/queries";
import { FunnelPage } from "@prisma/client";
import clsx from "clsx";
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  TabletsIcon,
  TabletSmartphone,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FC, FocusEventHandler, useEffect } from "react";
import { toast } from "sonner";

interface IFunnelEditorNavigation {
  subaccountId: string;
  funnelId: string;
  funnelPageDetails: FunnelPage;
}

const FunnelEditorNavigation: FC<IFunnelEditorNavigation> = ({
  subaccountId,
  funnelPageDetails,
  funnelId,
}) => {
  const router = useRouter();
  const { state, dispatch } = useEditor();

  useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: {
        funnelPageId: funnelPageDetails.id,
      },
    });
  }, [funnelPageDetails]);

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.value === funnelPageDetails.name) return;
    if (event.target.value) {
      await upsertFunnelPage(
        subaccountId,
        {
          id: funnelPageDetails.id,
          name: event.target.value,
          order: funnelPageDetails.order,
        },
        funnelId
      );
      toast.success("Saved Funnel Page title.");
      router.refresh();
    } else {
      toast.error("You need to have a title");
      event.target.value = funnelPageDetails.name;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements);
    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...funnelPageDetails,
          content: content,
        },
        funnelId
      );
      await saveActivityLogsNotification({
        description: `Updated a funnel page | ${response?.name}`,
        subaccountId,
      });
      toast.success("Saved Editor");
    } catch (error) {
      toast.error("Could not save page editor");
    }
  };

  return (
    <TooltipProvider>
      <nav
        className={clsx(
          "border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all ",
          { "!h0 !p-0 !overflow-hidden hidden": state.editor.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href={`/subaccount/${subaccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full">
            <Input
              defaultValue={funnelPageDetails.name}
              className="border-none h-5 m-0 p-0 text-lg "
              onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">
              Path: /{funnelPageDetails.pathName}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit"
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: value as DeviceTypes },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-slate-800 "
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            className="hover:bg-slate-800"
            variant={"ghost"}
            size={"icon"}
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
          >
            <Undo2 />
          </Button>
          <Button
            className="hover:bg-slate-800"
            variant={"ghost"}
            size={"icon"}
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col items-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Last Updated {funnelPageDetails.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};
export default FunnelEditorNavigation;
