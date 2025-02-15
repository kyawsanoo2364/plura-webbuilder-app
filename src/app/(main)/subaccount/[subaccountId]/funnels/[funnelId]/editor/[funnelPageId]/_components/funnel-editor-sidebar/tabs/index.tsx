import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, Settings2Icon, SquareStackIcon } from "lucide-react";

const TabList = () => {
  return (
    <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Settings2Icon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-muted size-10 p-0"
      >
        <Plus />
      </TabsTrigger>
      <TabsTrigger
        value="Layers"
        className="data-[state=active]:bg-muted size-10 p-0"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="data-[state=active]:bg-muted size-10 p-0"
      >
        <Database />
      </TabsTrigger>
    </TabsList>
  );
};
export default TabList;
