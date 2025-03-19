import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  moderateReview,
  type ModerateReviewFormData,
} from "@/actions/moderate-review";
import { ReviewState } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/shared/user-avatar";

import { SelectState } from "../shared/select-state";

function AdminReviewModal({
  reviewData,
  setReviewData,
  path,
  setPath,
  showAdminReviewModal,
  setShowAdminReviewModal,
}: {
  reviewData: ModerateReviewFormData;
  setReviewData: Dispatch<SetStateAction<ModerateReviewFormData>>;
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
  showAdminReviewModal: boolean;
  setShowAdminReviewModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const [updating, setUpdating] = useState(false);
  const [isApproved, setIsApproved] = useState(reviewData.isApproved);
  const [updateData, setUpdateData] =
    useState<ModerateReviewFormData>(reviewData);

  async function updateUserReview() {
    setUpdating(true);

    const { status, message } = await moderateReview(updateData, path);

    if (status === "error") {
      setUpdating(false);
      throw message;
    } else {
      setShowAdminReviewModal(false);
      setReviewData({} as ModerateReviewFormData);
      setPath("");
      setUpdating(false);
      setIsApproved(false);
    }
  }

  return (
    <Modal
      type="update-review"
      showModal={showAdminReviewModal}
      setShowModal={setShowAdminReviewModal}
      className="gap-0"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16">
        <UserAvatar
          user={{
            name: session?.user?.name || null,
            image: session?.user?.image || null,
          }}
        />
        <h3 className="text-lg font-semibold">Approve or update review</h3>
        <p className="text-center text-sm text-muted-foreground">
          <b>Info:</b>{" "}
          {`${isApproved ? "This review is already approved" : "Update review."}`}
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(updateUserReview(), {
            loading: `Updating review ...`,
            success: `Review updated successfully!`,
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
              defaultValue={reviewData.comment}
            ></Textarea>

            <Separator />

            <SelectState
              options={["APPROVED", "PENDING", "REJECTED"]}
              state={updateData.state}
              setState={(state) => {
                setUpdateData((prev) => ({
                  ...prev,
                  state: state as ReviewState,
                }));
              }}
              side="top"
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

export function useAdminReviewModal() {
  const [showAdminReviewModal, setShowAdminReviewModal] = useState(false);
  const [data, setData] = useState<ModerateReviewFormData>(
    {} as ModerateReviewFormData,
  );
  const [path, setPath] = useState<string>("");

  const AdminReviewModalCallback = useCallback(() => {
    return (
      <AdminReviewModal
        reviewData={data}
        setReviewData={setData}
        path={path}
        setPath={setPath}
        showAdminReviewModal={showAdminReviewModal}
        setShowAdminReviewModal={setShowAdminReviewModal}
      />
    );
  }, [
    showAdminReviewModal,
    setShowAdminReviewModal,
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
      setShowAdminReviewModal,
      AdminReviewModal: AdminReviewModalCallback,
    }),
    [setData, setShowAdminReviewModal, AdminReviewModalCallback, data, path],
  );
}
