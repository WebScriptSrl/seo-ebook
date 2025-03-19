import { redirect } from "next/navigation";
import { getSubscription } from "@/actions/newsletter-subscription";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNewsletterForm } from "@/components/forms/dashboard-newsletter-form";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";

export const metadata = constructMetadata({
  title: "Settings – Local SEO eBook",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  let newsletterSubscription;

  if (user && user.id && user.email) {
    newsletterSubscription = await getSubscription(user.email, "user");
  } else {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage your account and website settings."
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <DashboardNewsletterForm
          status={newsletterSubscription.status}
          newsletterData={newsletterSubscription}
          message={newsletterSubscription.message}
          userMail={user.email}
        />
        {user.role === "ADMIN" && (
          <UserRoleForm user={{ id: user.id, role: user.role }} />
        )}
        <DeleteAccountSection
          status={newsletterSubscription.status}
          newsletterData={newsletterSubscription}
        />
      </div>
    </>
  );
}
