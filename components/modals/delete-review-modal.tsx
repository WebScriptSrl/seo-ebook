import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { deleteReviews } from "@/actions/delete-reviews";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UserAvatar } from "@/components/shared/user-avatar";

import { Checkbox } from "../ui/checkbox";

function DeleteReviewModal({
  reviewsIds,
  setReviewsIds,
  path,
  setPath,
  showDeleteReviewModal,
  setShowDeleteReviewModal,
}: {
  reviewsIds: string[];
  setReviewsIds: Dispatch<SetStateAction<string[]>>;
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
  showDeleteReviewModal: boolean;
  setShowDeleteReviewModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);

  async function deleteUserReviews() {
    setDeleting(true);
    const { status, message } = await deleteReviews(reviewsIds, path);

    if (status === "error") {
      setDeleting(false);
      throw message;
    } else {
      setShowDeleteReviewModal(false);
      setReviewsIds([]);
      setDeleting(false);
    }
  }

  return (
    <Modal
      type="delete-review"
      showModal={showDeleteReviewModal}
      setShowModal={setShowDeleteReviewModal}
      className="gap-0"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16">
        <UserAvatar
          user={{
            name: session?.user?.name || null,
            image: session?.user?.image || null,
          }}
        />
        <h3 className="text-lg font-semibold">
          Delete {reviewsIds.length === 1 ? "Review" : "Reviews"}
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          <b>Warning:</b> This will permanently delete your{" "}
          {reviewsIds.length === 1 ? "review" : "reviews"} from your account.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteUserReviews(), {
            loading: `Deleting ${
              reviewsIds.length === 1 ? "review" : "reviews"
            }...`,
            success: `${
              reviewsIds.length === 1 ? "Review" : "Reviews"
            } deleted successfully!`,
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-accent px-4 py-8 text-left sm:px-16"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            name="verification"
            id="verification"
            required
            className="border-accent-foreground"
          />
          <label htmlFor="verification" className="block text-sm">
            Check here,{" "}
            <span className="font-semibold text-black dark:text-white">
              to confirm {reviewsIds.length === 1 ? "review" : "reviews"}{" "}
              removal
            </span>{" "}
          </label>
        </div>

        <Button
          type="submit"
          variant={deleting ? "disable" : "destructive"}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </Modal>
  );
}

export function useDeleteReviewModal() {
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
  const [reviewsIds, setReviewsIds] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");

  const DeleteReviewModalCallback = useCallback(() => {
    return (
      <DeleteReviewModal
        reviewsIds={reviewsIds}
        setReviewsIds={setReviewsIds}
        path={path}
        setPath={setPath}
        showDeleteReviewModal={showDeleteReviewModal}
        setShowDeleteReviewModal={setShowDeleteReviewModal}
      />
    );
  }, [
    showDeleteReviewModal,
    setShowDeleteReviewModal,
    reviewsIds,
    setReviewsIds,
    path,
    setPath,
  ]);

  return useMemo(
    () => ({
      reviewsIds,
      setReviewsIds,
      path,
      setPath,
      setShowDeleteReviewModal,
      DeleteReviewModal: DeleteReviewModalCallback,
    }),
    [
      setReviewsIds,
      setShowDeleteReviewModal,
      DeleteReviewModalCallback,
      reviewsIds,
      path,
    ],
  );
}
