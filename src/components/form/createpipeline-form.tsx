"use client";

import { saveActivityLogsNotification, upsertPipeline } from "@/lib/queries";
import { useModal } from "@/lib/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  defaultData?: Pipeline;
  subAccountId: string;
};

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

const CreatePipelineForm = ({ defaultData, subAccountId }: Props) => {
  const { data, isOpen, setOpen, setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    resolver: zodResolver(CreatePipelineFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData?.name || "" });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return;
    try {
      const response = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId,
      });
      await saveActivityLogsNotification({
        description: `Updates a pipeline | ${response?.name}`,
        subaccountId: subAccountId,
      });
      toast.success("Saved pipeline details");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Could not save pipeline details");
    }

    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
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
            <Button className="w-20 mt-4 " disabled={isLoading} type="submit">
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
export default CreatePipelineForm;
