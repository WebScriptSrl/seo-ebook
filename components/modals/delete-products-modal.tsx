import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { deleteProducts } from "@/actions/delete-products";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { UserAvatar } from "@/components/shared/user-avatar";

import { Checkbox } from "../ui/checkbox";

function DeleteProductModal({
  productsIds,
  setProductsIds,
  path,
  setPath,
  showDeleteProductModal,
  setShowDeleteProductModal,
}: {
  productsIds: string[];
  setProductsIds: Dispatch<SetStateAction<string[]>>;
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
  showDeleteProductModal: boolean;
  setShowDeleteProductModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);

  async function deleteProductsAction() {
    setDeleting(true);
    const { status, message } = await deleteProducts(productsIds, path);

    if (status === "error") {
      setDeleting(false);
      throw message;
    } else {
      setShowDeleteProductModal(false);
      setProductsIds([]);
      setDeleting(false);
    }
  }

  return (
    <Modal
      type="delete-product"
      showModal={showDeleteProductModal}
      setShowModal={setShowDeleteProductModal}
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
          Delete {productsIds.length === 1 ? "Product" : "Products"}
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          <b>Warning:</b> This will permanently delete your{" "}
          {productsIds.length === 1 ? "product" : "products"} from your account.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteProductsAction(), {
            loading: `Deleting ${
              productsIds.length === 1 ? "product" : "products"
            }...`,
            success: `${
              productsIds.length === 1 ? "Product" : "Products"
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
              to confirm {productsIds.length === 1 ? "product" : "products"}{" "}
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

export function useDeleteProductModal() {
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productsIds, setProductsIds] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");

  const DeleteProductModalCallback = useCallback(() => {
    return (
      <DeleteProductModal
        productsIds={productsIds}
        setProductsIds={setProductsIds}
        path={path}
        setPath={setPath}
        showDeleteProductModal={showDeleteProductModal}
        setShowDeleteProductModal={setShowDeleteProductModal}
      />
    );
  }, [
    productsIds,
    setProductsIds,
    path,
    setPath,
    showDeleteProductModal,
    setShowDeleteProductModal,
  ]);

  return useMemo(
    () => ({
      productsIds,
      setProductsIds,
      path,
      setPath,
      setShowDeleteProductModal,
      DeleteProductModal: DeleteProductModalCallback,
    }),
    [
      setProductsIds,
      setShowDeleteProductModal,
      DeleteProductModalCallback,
      productsIds,
      path,
    ],
  );
}
