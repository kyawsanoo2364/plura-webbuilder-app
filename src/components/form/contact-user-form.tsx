"use client";

import { saveActivityLogsNotification, upsertContact } from "@/lib/queries";
import { useModal } from "@/lib/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  subaccountId: string;
}

export const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const ContactUserForm: React.FC<Props> = ({ subaccountId }) => {
  const { setClose, data } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data?.contact) {
      form.reset(data?.contact);
    }
  }, [data, form.reset]);

  const isLoading = form.formState.isLoading;

  const handleSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
    try {
      const response = await upsertContact({
        email: values.email,
        subAccountId: subaccountId,
        name: values.name,
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Update a contact | ${response.name}`,
        subaccountId: subaccountId,
      });
      toast.success("Saved Contact!");
      setClose();
      router.refresh();
    } catch (error) {
      toast.error("Could not save contact details");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Info</CardTitle>
        <CardDescription>
          You can assign tickets to contacts and set a value for each contact in
          the ticket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Contact Details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default ContactUserForm;
