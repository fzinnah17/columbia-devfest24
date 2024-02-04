import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SearchButton() {
  const router = useRouter();
  const buttonRef = useRef(null);
  const form = useForm({
    defaultValues: {
      filter: "",
    },
  });
  function handleSearchSubmit(values) {
    const params = new URLSearchParams([["filter", values.filter]]);
    router.push(`/search/?${params.toString()}`);
    form.reset();
    buttonRef.current.click();
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Search className="h-8 w-8 cursor-pointer stroke-white" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
          <Separator />
        </DialogHeader>
        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSearchSubmit)}
              className="flex"
            >
              <FormField
                control={form.control}
                name="filter"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        placeholder="Enter name or username"
                        {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button><Search /></Button>
              <DialogClose asChild>
                  <span ref={buttonRef}></span>
              </DialogClose>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
