import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { updateReview, UpdateReviewFormData } from "@/actions/update-review";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RatingComponent } from "@/components/shared/rating";
import { UserAvatar } from "@/components/shared/user-avatar";

function UpdateReviewModal({
  reviewData,
  setReviewData,
  path,
  setPath,
  showUpdateReviewModal,
  setShowUpdateReviewModal,
}: {
  reviewData: UpdateReviewFormData;
  setReviewData: Dispatch<SetStateAction<UpdateReviewFormData>>;
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
  showUpdateReviewModal: boolean;
  setShowUpdateReviewModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const [updating, setUpdating] = useState(false);
  const [isApproved, setIsApproved] = useState(reviewData.isApproved);
  const [updateData, setUpdateData] =
    useState<UpdateReviewFormData>(reviewData);

  async function updateUserReview() {
    setUpdating(true);

    const { status, message } = await updateReview(updateData, path);

    if (status === "error") {
      setUpdating(false);
      throw message;
    } else {
      setShowUpdateReviewModal(false);
      setReviewData({} as UpdateReviewFormData);
      setPath("");
      setUpdating(false);
      setIsApproved(false);
    }
  }

  return (
    <Modal
      type="update-review"
      showModal={showUpdateReviewModal}
      setShowModal={setShowUpdateReviewModal}
      className="gap-0"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16">
        <UserAvatar
          user={{
            name: session?.user?.name || null,
            image: session?.user?.image || null,
          }}
        />
        <h3 className="text-lg font-semibold">Update your review</h3>
        <p className="text-center text-sm text-muted-foreground">
          <b>Info:</b>{" "}
          {`${isApproved ? "This review was approved before and it will be sent for new approval." : "Update your review."}`}
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(updateUserReview(), {
            loading: `Updating ${"your review"}...`,
            success: `${"Review"} updated successfully!`,
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-accent px-4 py-8 text-left sm:px-16"
      >
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <Textarea
              name="comment"
              id="comment"
              required
              className="h-48 w-full"
              onChange={(e) => {
                setUpdateData((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }));
              }}
            >
              {reviewData.comment}
            </Textarea>

            <Separator />

            <RatingComponent
              rating={reviewData.rating}
              variant="orange"
              fill={true}
              onRatingChange={(rating) => {
                setUpdateData((prev) => ({
                  ...prev,
                  rating,
                }));
              }}
            />
          </div>

          <Separator />

          <div className="flex w-full items-center justify-center gap-2">
            <Checkbox
              name="verification"
              id="verification"
              required
              className="border-accent-foreground"
            />
            <label htmlFor="verification" className="block text-sm">
              Check here,{" "}
              <span className="font-semibold text-black dark:text-white">
                to confirm your update
              </span>{" "}
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant={updating ? "disable" : "default"}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
}

export function useUpdateReviewModal() {
  const [showUpdateReviewModal, setShowUpdateReviewModal] = useState(false);
  const [data, setData] = useState<UpdateReviewFormData>(
    {} as UpdateReviewFormData,
  );
  const [path, setPath] = useState<string>("");

  const UpdateReviewModalCallback = useCallback(() => {
    return (
      <UpdateReviewModal
        reviewData={data}
        setReviewData={setData}
        path={path}
        setPath={setPath}
        showUpdateReviewModal={showUpdateReviewModal}
        setShowUpdateReviewModal={setShowUpdateReviewModal}
      />
    );
  }, [
    showUpdateReviewModal,
    setShowUpdateReviewModal,
    data,
    setData,
    path,
    setPath,
  ]);

  return useMemo(
    () => ({
      data,
      setData,
      path,
      setPath,
      setShowUpdateReviewModal,
      UpdateReviewModal: UpdateReviewModalCallback,
    }),
    [setData, setShowUpdateReviewModal, UpdateReviewModalCallback, data, path],
  );
}
