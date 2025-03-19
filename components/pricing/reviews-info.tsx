"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

import { UserReview } from "types";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icons } from "@/components//shared/icons";
import { RatingComponent } from "@/components//shared/rating";
import { Badge } from "@/components//ui/badge";
import { Separator } from "@/components//ui/separator";
import { useDeleteReviewModal } from "@/components/modals/delete-review-modal";
import { useUpdateReviewModal } from "@/components/modals/update-review-modal";

interface ReviewInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userReviews: UserReview[];
  pathname: string;
}

export function ReviewsInfo(
  { userReviews }: ReviewInfoProps,
  pathname: string,
) {
  const {
    setPath,
    reviewsIds,
    setReviewsIds,
    setShowDeleteReviewModal,
    DeleteReviewModal,
  } = useDeleteReviewModal();

  const { setShowUpdateReviewModal, UpdateReviewModal, setData } =
    useUpdateReviewModal();

  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [editReview, setEditReview] = useState<UserReview>();

  useEffect(() => {
    setSelectedReviews(reviewsIds);
    if (editReview) {
      setData({
        id: editReview.id,
        comment: editReview.review,
        rating: editReview.rating,
        isApproved: editReview.approved === "APPROVED",
      });
    }
  }, [reviewsIds, editReview, setData]);

  return (
    <Suspense
      fallback={
        <Skeleton className="hidden h-16 w-full rounded-full lg:flex" />
      }
    >
      {userReviews.length > 0 ? (
        <>
          <DeleteReviewModal />
          <UpdateReviewModal />
          <Card>
            <CardHeader>
              <CardTitle>
                Your {userReviews.length === 1 ? "Review" : "Reviews"}
              </CardTitle>
              <CardDescription>
                You have {userReviews.length}{" "}
                {userReviews.length === 1 ? "review" : "reviews"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ToggleGroup
                type="multiple"
                variant="outline"
                className="flex flex-col space-y-4"
                onValueChange={(value) => {
                  setSelectedReviews(value);
                }}
              >
                {userReviews.map((item) => (
                  <ToggleGroupItem
                    key={item.id}
                    value={item.id}
                    className="flex size-full flex-col gap-5 p-4"
                  >
                    <div className="flex w-full items-center justify-between">
                      <Badge
                        variant="outline"
                        className={cn(
                          selectedReviews.includes(item.id)
                            ? "text-gradient_indigo-purple"
                            : "text-gradient_cyan-red",
                        )}
                      >
                        {selectedReviews.includes(item.id)
                          ? "Selected"
                          : `${item.product}`}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={cn(
                          item.approved === "APPROVED"
                            ? "text-gradient_cyan-red"
                            : item.approved === "PENDING"
                              ? "text-gradient_indigo-purple"
                              : "text-red-500",
                        )}
                      >
                        {item.approved === "APPROVED"
                          ? "Approved"
                          : item.approved === "PENDING"
                            ? "Pending"
                            : "Rejected"}
                      </Badge>
                    </div>

                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <span className="text-xs text-muted-foreground">
                        Job:
                      </span>{" "}
                      <p className="text-sm">
                        {item.job},{" "}
                        <span className="text-xs text-muted-foreground">
                          {item.location}
                        </span>
                      </p>
                    </div>

                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <span className="text-xs text-muted-foreground">
                        Review content:
                      </span>{" "}
                      <q className="text-sm italic">{item.review}</q>
                    </div>

                    <RatingComponent
                      rating={item.rating}
                      variant="orange"
                      fill={false}
                    />

                    <Separator />

                    <div className="flex min-h-min w-full flex-col items-center gap-3 md:flex-row md:justify-between md:gap-5">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-xs text-muted-foreground">
                          Added on:
                        </span>{" "}
                        {formatDate(item.createdAt.toDateString())}
                      </p>

                      {selectedReviews.includes(item.id) && (
                        <div
                          className="flex items-center gap-5 text-muted-foreground"
                          aria-label="Edit or delete review"
                        >
                          <Icons.trash
                            className="cursor-pointer hover:scale-110 hover:stroke-red-500"
                            size={20}
                            onClick={() => {
                              setReviewsIds([item.id]);
                              setPath(pathname);
                              setShowDeleteReviewModal(true);
                            }}
                          />

                          <Icons.edit
                            className="cursor-pointer hover:scale-110 hover:stroke-cyan-500"
                            size={20}
                            onClick={() => {
                              setEditReview(item);
                              setShowUpdateReviewModal(true);
                            }}
                          />
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        <span className="text-xs text-muted-foreground">
                          Last updated on:
                        </span>{" "}
                        {formatDate(item.updatedAt.toDateString())}
                      </p>
                    </div>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-end md:space-y-0">
              {selectedReviews.length > 0 ? (
                <Button
                  variant={"destructive"}
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setReviewsIds(selectedReviews);
                    setPath(pathname);
                    setShowDeleteReviewModal(true);
                  }}
                >
                  Delete{" "}
                  {selectedReviews.length > 0 ? selectedReviews.length : ""}{" "}
                  {selectedReviews.length === 1 ? "review" : "reviews"}
                </Button>
              ) : (
                <div className="flex w-full items-center justify-center md:justify-between">
                  <Link href={"/dashboard/reviews"}>
                    <Button size={"sm"}>Add New Review</Button>
                  </Link>
                  <p className="hidden text-sm text-muted-foreground md:block">
                    Select a review to edit or delete
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>You have no reviews yet !</CardTitle>
            <CardDescription>
              Check out our <span className="text-primary">Local SEO book</span>{" "}
              and get started!
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
            <Link href={"/pricing"}>
              <Button>Order a book</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </Suspense>
  );
}
