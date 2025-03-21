"use client";

import { useState, useTransition } from "react";
import {
  updateSellSession,
  type FormData,
} from "@/actions/update-sell-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { SellSession } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { sellSessionSchema } from "@/lib/validations/sell-session";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface SellSessionFormProps {
  sellSession: SellSession;
}

export function SellSessionForm({ sellSession }: SellSessionFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [data, setData] = useState(sellSession);
  const [isPending, startTransition] = useTransition();

  const updateSession = updateSellSession.bind(null, data);
  const stopSellOptions = ["Stop Sell", "Sell Started"];
  const bannerOptions = ["Show Banner", "Hide Banner"];

  const form = useForm<FormData>({
    resolver: zodResolver(sellSessionSchema),
    values: {
      name: data.name,
      sellStop: data.sellStop,
      showBanner: data.showBanner,
      bannerTitle: data.bannerTitle ? data.bannerTitle : "",
      description: data.description ? data.description : "",
    },
  });

  const onSubmit = (data: z.infer<typeof sellSessionSchema>) => {
    startTransition(async () => {
      const { status } = await updateSession(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "The sell session was not updated. Please try again.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("The sell session has been updated.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SectionColumns
          title="Sell Session"
          description="Configure your sell session settings. In case you want to stop selling, you can enable the sell stop option."
        >
          <div className="flex w-full flex-col items-center gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Session Name</FormLabel>
                  <Input
                    {...field}
                    type="text"
                    onChange={(e) => {
                      setUpdated(data.name !== e.target.value);
                      setData({ ...data, name: e.target.value });
                    }}
                    name={field.name}
                    disabled
                  />
                  <FormMessage />
                  <FormDescription className="text-end text-xs text-muted-foreground">
                    It will be updated to manage multiple sessions.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellStop"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Sell Stop</FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      const valueToBol = value === "Stop Sell";
                      setUpdated(data.sellStop !== valueToBol);
                      setData({ ...data, sellStop: valueToBol });
                    }}
                    name={field.name}
                    defaultValue={data.sellStop ? "Stop Sell" : "Sell Started"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stopSellOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription className="text-end text-xs text-muted-foreground">
                    {data.sellStop
                      ? "The sell session is stopped."
                      : "The sell session is active."}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showBanner"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Show Banner</FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      const valueToBol = value === "Show Banner";
                      setUpdated(data.showBanner !== valueToBol);
                      setData({ ...data, showBanner: valueToBol });
                    }}
                    name={field.name}
                    defaultValue={
                      data.showBanner ? "Show Banner" : "Hide Banner"
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bannerOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription className="text-end text-xs text-muted-foreground">
                    {data.showBanner
                      ? "The banner is visible."
                      : "The banner is hidden."}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerTitle"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Banner Title</FormLabel>
                  <Input
                    {...field}
                    type="text"
                    onChange={(e) => {
                      setUpdated(data.bannerTitle !== e.target.value);
                      setData({ ...data, bannerTitle: e.target.value });
                    }}
                    name={field.name ? field.name : ""}
                  />
                  <FormMessage />
                  <FormDescription className="text-end text-xs text-muted-foreground">
                    The title of the banner.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Description</FormLabel>
                  <Input
                    {...field}
                    type="text"
                    onChange={(e) => {
                      setUpdated(data.description !== e.target.value);
                      setData({ ...data, description: e.target.value });
                    }}
                    name={field.name ? field.name : ""}
                  />
                  <FormMessage />
                  <FormDescription className="text-end text-xs text-muted-foreground">
                    Short description of why the sell session is stopped.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={updated ? "default" : "disable"}
              disabled={isPending || !updated}
              className="w-[67px] shrink-0 px-0 sm:w-[130px]"
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <p>
                  Save
                  <span className="hidden sm:inline-flex">&nbsp;Changes</span>
                </p>
              )}
            </Button>
          </div>
        </SectionColumns>
      </form>
    </Form>
  );
}
