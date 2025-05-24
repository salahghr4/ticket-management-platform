import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCreateAttachment } from "@/hooks/useAttachments";
import {
  attachmentFormValues,
  attachmentsSchema,
} from "@/validation/attachments";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AttachmentFormProps {
  ticketId: number;
  onSuccess?: () => void;
  onClose: (value: boolean) => void;
}

const AttachmentForm = ({
  ticketId,
  onClose,
  onSuccess,
}: AttachmentFormProps) => {
  const form = useForm<attachmentFormValues>({
    resolver: zodResolver(attachmentsSchema),
    defaultValues: {
      attachments: [],
    },
  });

  const createAttachment = useCreateAttachment();

  const attachments = form.watch("attachments");

  const onFileReject = (file: File, message: string) => {
    toast.error(
      <div className="flex flex-col gap-1">
        <p>{message}</p>
        <p>
          <span className="font-bold">
            {file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}
          </span>{" "}
          has been rejected
        </p>
      </div>
    );
  };

  const onSubmit = async (data: attachmentFormValues) => {
    if (!data.attachments?.length) {
      toast.error("Please select at least one file to upload");
      return;
    }
    toast.promise(
      createAttachment.mutateAsync({ ticketId, attachments: data }),
      {
        loading: "Adding Attachments...",
        success: "Attachments added successfully!",
        error: "Failed to add attachments. Please try again.",
      }
    );
    onSuccess?.();
    onClose(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onValueChange={field.onChange}
                  accept=".jpg,.jpeg,.png,.gif,.avif,.webp,.zip,.rar,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  maxSize={10 * 1024 * 1024}
                  onFileReject={onFileReject}
                  multiple
                  className="max-w-full"
                >
                  <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">
                        Drag & drop files here
                      </p>
                      <p className="text-muted-foreground text-xs">
                        files must be up to 10MB each
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                      >
                        Browse files
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList>
                    {field.value?.map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                      >
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <X />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!attachments?.length || createAttachment.isPending}
          >
            {createAttachment.isPending ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AttachmentForm;
