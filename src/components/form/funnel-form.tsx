"use client";

import { saveActivityLogsNotification, upsertFunnel } from "@/lib/queries";
import { CreateFunnelFormSchema } from "@/lib/types";
import { useModal } from "@/lib/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Funnel } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import FileUploading from "../global/file-uploading";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface CreateFunnelProps {
  defaultData?: Funnel;
  subAccountId: string;
}

const FunnelForm: React.FC<CreateFunnelProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateFunnelFormSchema>>({
    resolver: zodResolver(CreateFunnelFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
      description: defaultData?.description || "",
      favicon: defaultData?.favicon || "",
      subDomainName: defaultData?.subDomainName || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData?.name || "",
        description: defaultData?.description || "",
        favicon: defaultData?.favicon || "",
        subDomainName: defaultData?.subDomainName || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof CreateFunnelFormSchema>) => {
    if (!subAccountId) return;

    try {
      const response = await upsertFunnel(
        subAccountId,
        {
          ...values,
          liveProducts: defaultData?.liveProducts || "[]",
        },
        defaultData?.id || v4()
      );
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Update Funnel | ${response.name}`,
        subaccountId: subAccountId,
      });
      if (response) {
        toast.success("Saved Funnel Details.");
      }
      setClose();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Opps! Could not save funnel details.");
    }
  };

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-3xl">Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              disabled={isLoading}
              name="name"
              control={form.control}
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
              name="description"
              disabled={isLoading}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit more about this funnel."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              name="subDomainName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="Sub Domain for funnel...." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              name="favicon"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUploading
                      apiEndPoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelForm;
