"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import FileUploading from "../global/file-uploading";
import { Button } from "../ui/button";

type Props = {
  subaccountId: string;
};

const formSchema = z.object({
  link: z.string().min(1, "MediaFile are required!"),
  name: z.string().min(1, "Name are required!"),
});

export default function UploadMediaForm({ subaccountId }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createMedia(subaccountId, values);
      await saveActivityLogsNotification({
        description: `Uploaded media file | ${response.name} `,
        subaccountId: subaccountId,
      });
      router.refresh();
      toast.success("Uploaded Media");
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload media file");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>Please enter the details your file</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="link"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Media File</FormLabel>
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
            <Button
              type="submit"
              className="mt-4"
              disabled={form.formState.isSubmitting}
            >
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
