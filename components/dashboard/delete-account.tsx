"use client";

import { useEffect, useState } from "react";
import { NewsletterSubscriptionData } from "@/actions/newsletter-subscription";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Icons } from "@/components/shared/icons";

interface NewsletterFormProps {
  data: NewsletterSubscriptionData;
}

export function DeleteAccountSection({
  status,
  newsletterData,
}: {
  status: number;
  newsletterData: NewsletterFormProps;
}) {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  const [newsletterSubscription, setNewsletterSubscription] =
    useState<boolean>(false);

  useEffect(() => {
    if (status === 404 || status === 500) return;
    if (newsletterData.data.subscribed !== "UNSUBSCRIBED") {
      setNewsletterSubscription(true);
    }
  }, [newsletterData, status]);

  return (
    <>
      <DeleteAccountModal />
      <SectionColumns
        title="Delete Account"
        description="This is a danger zone - Be careful !"
      >
        <div className="flex flex-col gap-4 rounded-xl border border-red-400 p-4 dark:border-red-900">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium">Are you sure ?</span>

              {newsletterSubscription ? (
                <div className="flex items-center gap-1 rounded-md bg-red-600/10 p-1 pr-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-500">
                  <div className="m-0.5 rounded-full bg-red-600 p-[3px]">
                    <Icons.close size={10} className="text-background" />
                  </div>
                  Active Newsletter
                </div>
              ) : null}
            </div>
            <div className="text-balance text-sm text-muted-foreground">
              Permanently delete your {siteConfig.name} account
              {newsletterSubscription
                ? " and your newsletter subscription"
                : ""}
              . Please proceed with caution.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="destructive"
              onClick={() => setShowDeleteAccountModal(true)}
            >
              <Icons.trash className="mr-2 size-4" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </SectionColumns>
    </>
  );
}
