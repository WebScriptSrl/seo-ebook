"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { addReview } from "@/actions/add-review";
import { Product, UserProductOrder } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import getConfig from "@/config/cookie-config";
import { products } from "@/config/products";
import { siteConfig } from "@/config/site";
import useLocalStorage from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";
import { RatingComponent } from "@/components/shared/rating";

interface AddReviewFormProps extends React.HTMLAttributes<HTMLFormElement> {
  userOrders?: any;
  user: string;
}

const FormSchema = z.object({
  product: z.string({
    message: 'Select a product, or `"General feedback"`',
  }),
  rating: z
    .number()
    .int({ message: "Rating must be a whole number" })
    .min(1, { message: "Rating must be at least 1" })
    .max(5),
  review: z.string().min(20).max(500),
  job: z.string().min(3).max(32),
  location: z.string().min(3).max(32),
});

export function AddReviewForm({ userOrders, user }: AddReviewFormProps) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectOptions, setSelectOptions] = useState<string[]>([]);

  const [reviewRating, setReviewRating] = useState(0);

  const [product, setProduct] = useLocalStorage("product", "");
  const [rating, setRating] = useLocalStorage("rating", 0);
  const [content, setContent] = useLocalStorage("content", "");
  const [job, setJob] = useLocalStorage("job", "");
  const [location, setLocation] = useLocalStorage("location", "");

  useEffect(() => {
    setMounted(true);

    setReviewRating(rating);
    const values = [...products, "General feedback"];
    setSelectOptions(values);
  }, [rating]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product: product,
      rating: rating,
      review: content,
      job: job,
      location: location,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { status } = await addReview({
        userId: user,
        product: data.product,
        job: data.job,
        location: data.location,
        rating: data.rating,
        comment: data.review,
      });

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your review was not added. Please try again.",
        });
      } else {
        form.reset();
        setProduct("");
        setRating(0);
        setContent("");
        setJob("");
        setLocation("");
        toast.success("Your review has been added.");
      }
    });
  }

  return (
    <Suspense
      fallback={
        <Skeleton className="hidden h-16 w-full rounded-full lg:flex" />
      }
    >
      {mounted && (
        <Card>
          <CardHeader>
            <CardTitle>Add a review</CardTitle>
            <CardDescription>
              Let us know what you think about our products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col space-y-2 sm:max-w-md md:max-w-lg lg:max-w-2xl"
              >
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a product</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setProduct(value);
                          field.onChange(value);
                        }}
                        value={product}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={product} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectOptions.map((prod) => (
                            <SelectItem key={prod} value={prod}>
                              {prod}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <FormDescription>
                        Select a product, or choose{" "}
                        <span>{`"General feedback"`}</span> to leave a general
                        review.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Separator />
                <Separator />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>

                      <RatingComponent
                        rating={rating}
                        fill
                        size={32}
                        variant="orange"
                        defaultValue={rating}
                        onRatingChange={(value) => {
                          setRating(value);
                          field.onChange(value);
                        }}
                        onReset={() => {
                          setRating(0);
                          field.onChange(0);
                        }}
                        className="flex flex-col items-center gap-3"
                      />
                      <FormMessage />
                      <FormDescription>
                        Select the number of stars to rate the product.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Separator />
                <Separator />

                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Content</FormLabel>

                      <Textarea
                        {...field}
                        placeholder="Write your review"
                        minLength={20}
                        maxLength={500}
                        onChange={(e) => {
                          setContent(e.target.value);
                          field.onChange(e);
                        }}
                        className="h-36"
                      />
                      <FormMessage />
                      <FormDescription>
                        Write a review of 20 to 500 characters.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Separator />
                <Separator />

                <FormField
                  control={form.control}
                  name="job"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job</FormLabel>

                      <Input
                        {...field}
                        type="text"
                        placeholder="Your job title"
                        minLength={3}
                        maxLength={50}
                        onChange={(e) => {
                          setJob(e.target.value);
                          field.onChange(e);
                        }}
                      />
                      <FormMessage />
                      <FormDescription>
                        Enter your job title or role.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Separator />
                <Separator />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>

                      <Input
                        {...field}
                        type="text"
                        placeholder="Your location"
                        minLength={3}
                        maxLength={50}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          field.onChange(e);
                        }}
                      />
                      <FormMessage />
                      <FormDescription>
                        Enter your country and city. For example,{" "}
                        <span className="italic">{`"London, UK"`}</span>.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Separator />
                <Separator />

                {form.formState.isValid ? (
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    variant={"default"}
                    className="flex min-w-40 max-w-40 gap-2 self-center px-4 sm:self-end"
                  >
                    {isPending ? (
                      <Icons.spinner className="size-4 animate-spin" />
                    ) : (
                      <Icons.star className="size-4" />
                    )}
                    Add review
                  </Button>
                ) : (
                  <Button
                    disabled={!form.formState.isDirty}
                    type="button"
                    variant={"destructive"}
                    className="min-w-40 max-w-40 self-center px-4 sm:self-end"
                    onClick={() => {
                      form.reset();
                      setProduct("");
                      setRating(0);
                      setContent("");
                      setJob("");
                      setLocation("");
                    }}
                  >
                    Reset form
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
            <p className="text-center text-sm text-muted-foreground">
              Reviews need to be moderated before they are published. Please be
              respectful and constructive.{" "}
            </p>
          </CardFooter>
        </Card>
      )}
    </Suspense>
  );
}
