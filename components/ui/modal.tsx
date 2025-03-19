"use client";

import { Dispatch, SetStateAction } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { useRouter } from "next/router";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  type:
    | "signin"
    | "delete-account"
    | "cookies-settings"
    | "delete-review"
    | "update-review";
  children: React.ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
}

export function Modal({
  type,
  children,
  className,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
}: ModalProps) {
  // const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose && onClose();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
    }
    // else, this is intercepting route @modal
    // else {
    // router.back();
    // }
  };
  const { isMobile } = useMediaQuery();

  const modalTitle =
    type === "signin"
      ? "Sign In Modal"
      : type === "cookies-settings"
        ? "Cookies Consent Settings Modal"
        : type === "delete-account"
          ? "Delete Account Modal"
          : type === "delete-review"
            ? "Delete Review Modal"
            : type === "update-review"
              ? "Update Review Modal"
              : "Modal";

  const modalDescription =
    type === "signin"
      ? "Sign in on SEO.eBook website modal"
      : type === "cookies-settings"
        ? "Manage cookies consent settings"
        : type === "delete-account"
          ? "Permanent account deletion modal"
          : type === "delete-review"
            ? "Permanently delete reviews modal"
            : type === "update-review"
              ? "Update your review modal"
              : "Modal";

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
      >
        <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background",
              className,
            )}
            aria-modal="true"
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>
            <VisuallyHidden>
              <Drawer.Title>{modalTitle}</Drawer.Title>
              <Drawer.Description>{modalDescription}</Drawer.Description>
            </VisuallyHidden>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "overflow-hidden p-0 md:max-w-md md:rounded-2xl md:border",
          className,
        )}
        aria-modal="true"
      >
        <VisuallyHidden id="modal-description">
          <DialogTitle className="text-lg font-bold">{modalTitle}</DialogTitle>
          <Drawer.Description>{modalDescription}</Drawer.Description>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  );
}
