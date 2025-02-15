"use client";

import {
  getSubAccountTeamMembers,
  saveActivityLogsNotification,
  searchContacts,
  upsertTicket,
} from "@/lib/queries";
import { TicketWithTags } from "@/lib/types";
import { useModal } from "@/lib/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckIcon, ChevronsUpDown, Loader2, User2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import TagCreator from "../global/tag-creator";

type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
};

const currencyNumberRegex = /^\d+(\.\d(1,2))?$/;

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price",
  }),
});

const TicketForm = ({ laneId, subaccountId, getNewTicket }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [allTeamMember, setAllTeamMember] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData?.ticket?.Assigned?.id || ""
  );
  const form = useForm<z.infer<typeof TicketFormSchema>>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.ticket?.name || "",
      description: defaultData?.ticket?.description || "",
      value: String(defaultData?.ticket?.value || 0),
    },
  });
  const isLoading = form.formState.isLoading;

  useEffect(() => {
    if (subaccountId) {
      const fetchData = async () => {
        const response = await getSubAccountTeamMembers(subaccountId);
        if (response) {
          setAllTeamMember(response);
        }
      };
      fetchData();
    }
  }, [subaccountId]);

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;
    try {
      const response = await upsertTicket(
        {
          ...values,
          laneId,
          id: defaultData?.ticket?.id,
          assignedUserId: assignedTo,
          ...(contact ? { customerId: contact } : {}),
        },
        tags
      );
      await saveActivityLogsNotification({
        description: `Updated a ticket | ${response.name}`,
        subaccountId: subaccountId,
      });
      toast.success("Saved details");
      if (response) getNewTicket(response);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Opps Could not save ticket details");
    }
    setClose();
  };

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket.description || "",
        value: String(defaultData.ticket.value || 0),
      });
    }
    if (defaultData.ticket?.customerId) {
      setContact(defaultData.ticket.customerId);
    }
    const fetchData = async () => {
      const response = await searchContacts(
        defaultData?.ticket?.Customer?.name || ""
      );
      setContactList(response);
      return response;
    };

    fetchData();
  }, [defaultData]);

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h3>Add Tags</h3>
              <TagCreator
                subAccountId={subaccountId}
                getSelectedTags={setTags}
                defaultTags={defaultData.ticket?.Tags || []}
              />
              <FormLabel>Assigned To Team Member</FormLabel>
              <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage alt="Contact" />
                          <AvatarFallback className="bg-primary text-sm text-white">
                            <User2 size={14} />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          Not Assigned
                        </span>
                      </div>
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allTeamMember.map((teamMember) => (
                    <SelectItem key={teamMember.id} value={teamMember.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage
                            alt="contact"
                            src={teamMember.avatarUrl}
                          />
                          <AvatarFallback className="bg-primary text-sm text-white">
                            <User2 size={14} />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-sm">
                          {teamMember.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormLabel>Customer</FormLabel>
              <Popover>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant={"outline"}
                    role="combobox"
                    className="justify-between"
                  >
                    {contact
                      ? contactList.find((c) => c.id === contact)?.name
                      : "Select Customer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      className="h-9"
                      value={search}
                      onValueChange={async (value) => {
                        setSearch(value);
                        const response = await searchContacts(value);
                        setContactList(response);
                        setSearch("");
                      }}
                    />
                    <CommandEmpty>No Customer found.</CommandEmpty>
                    <CommandGroup>
                      {contactList.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={(currentValue) => {
                            setContact(
                              currentValue === contact ? "" : currentValue
                            );
                          }}
                        >
                          {c.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto size-4",
                              contact === c.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button className="w-20 mt-4" disabled={isLoading} type="submit">
                {form.formState.isSubmitted ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default TicketForm;
