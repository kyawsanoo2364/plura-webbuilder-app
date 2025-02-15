import { Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import TagComponent from "./tag";
import { PlusCircleIcon, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  deleteTag,
  getTagsFromSubaccount,
  saveActivityLogsNotification,
  upsertTag,
} from "@/lib/queries";
import { ta } from "date-fns/locale";

type Props = {
  subAccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags?: Tag[];
};

const TagColors = ["BLUE", "ORANGE", "GREEN", "ROSE", "PURPLE"] as const;
export type TagColor = (typeof TagColors)[number];

const TagCreator = ({ subAccountId, getSelectedTags, defaultTags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTag = async () => {
    if (!value) {
      toast.error("Tags need to have a name");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    const tagData: Tag = {
      id: v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: value,
      color: selectedColor,
      subAccountId,
    };

    setTags([...tags, tagData]);
    setValue("");
    setSelectedColor("");
    try {
      const response = await upsertTag(subAccountId, tagData);
      await saveActivityLogsNotification({
        description: `Updated a tag | ${response.name}`,
        subaccountId: subAccountId,
      });
    } catch (error) {
      console.log(error);
      toast.error("Could not create tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
    try {
      const response = await deleteTag(tagId);
      await saveActivityLogsNotification({
        description: `Deleted a tag | ${response.name}`,
        subaccountId: subAccountId,
      });
      toast.success("The tag is deleted from your subaccount.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Could not delete tag.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTagsFromSubaccount(subAccountId);
      if (response) setTags(response.Tags);
    };
    fetchData();
  }, [subAccountId]);

  return (
    <AlertDialog>
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
            {selectedTags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <TagComponent title={tag.name} colorName={tag.color} />
                <X
                  size={14}
                  className="text-muted-foreground cursor-pointer "
                  onClick={() => handleDeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 my-2">
          {TagColors.map((colorName) => (
            <TagComponent
              key={colorName}
              selectedColor={setSelectedColor}
              title=""
              colorName={colorName}
            />
          ))}
        </div>
        <div className="relative">
          <CommandInput
            placeholder="Search for tag..."
            value={value}
            onValueChange={setValue}
          />
          <PlusCircleIcon
            onClick={handleAddTag}
            size={20}
            className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"
          />
        </div>
        <CommandList>
          <CommandSeparator />
          <CommandGroup heading="Tags">
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent title={tag.name} colorName={tag.color} />
                </div>
                <AlertDialogTrigger>
                  <Trash
                    size={16}
                    className="cursor-pointer text-muted-foreground hover:text-rose-400 transition-all"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                      Are your abolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      This action cannot be undone. This will permanently delete
                      your the tag and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </AlertDialog>
  );
};
export default TagCreator;
