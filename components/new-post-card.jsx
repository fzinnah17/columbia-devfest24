"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createNewPost } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { FileUpload } from "./file-upload";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { formSchema } from "@/schemas";

const NewPostCard = ({ user }) => {
    const router = useRouter();
    const ref = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      image: "",
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    await createNewPost(values);
    router.refresh();
    form.reset();
    setIsSubmitting(false);
    ref.current.click();  // need to manually close dialog after submit
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md flex gap-3 max-w-2xl relative w-full">
      <Image
        className="w-12 h-12 rounded-full"
        src={
          user.profilePicUrl
            ? user.profilePicUrl
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzykHG9uAxSMQWR-w0PL11LVzi2WD9IcXruJNMu0WMWQ&s"
        }
        alt="User Profile"
        height={100}
        width={100}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button className="form-textarea mt-1 block w-full rounded-md bg-gray-100 focus:outline-none dark:hover:bg-slate-300 hover:bg-slate-200 text-left text-gray-500">
            {`What's on your mind, ${user.name}?`}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex gap-3 flex-col"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        id="new-post"
                        className="form-textarea mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add an image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          endpoint={'authorizedImage'}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              <DialogFooter>
                <div className="flex items-center space-x-4">
                        <Button
                            disabled={isSubmitting}
                            className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none"
                            type="submit"
                        >
                            Post
                        </Button>
                </div>
                <DialogClose asChild>
                  <span ref={ref}></span>
              </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewPostCard;
