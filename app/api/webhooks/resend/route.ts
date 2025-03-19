import { headers } from "next/headers";
import { WebhookEvent } from "@/types";

import { prisma } from "@/lib/db";
import { webhook } from "@/lib/resend";

export async function POST(req: Request, res: Response) {
  const svix_id = headers().get("svix-id");
  const svix_timestamp = headers().get("svix-timestamp");
  const svix_signature = headers().get("svix-signature");

  const body = await req.text();

  let msg;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    msg = "Missing required headers";
    return new Response(msg, { status: 400 });
  }

  try {
    msg = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (error) {
    msg = `Webhook Error: ${error.message}`;
    return new Response(msg, { status: 400 });
  }

  const event = msg as WebhookEvent;

  switch (event.type) {
    case "email.sent":
      await prisma.email.upsert({
        where: { emailId: event.data.email_id },
        update: {},
        create: {
          emailId: event.data.email_id,
          type: "resend",
          subject: event.data.subject,
          emails: event.data.to,
          sentAt: new Date(),
        },
      });

      return new Response("Email sent event received", { status: 200 });
    case "email.delivered":
      await prisma.email.update({
        where: { emailId: event.data.email_id },
        data: {
          delivered: true,
          deliveredAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return new Response("Email delivered event received", { status: 200 });
    case "email.opened":
      return new Response("Email opened event received", { status: 200 });
    case "email.clicked":
      return new Response("Email clicked event received", { status: 200 });
    case "email.bounced":
      await prisma.email.update({
        where: { emailId: event.data.email_id },
        data: {
          bouncedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return new Response("Email bounced event received", { status: 200 });
    case "email.complained":
      await prisma.email.update({
        where: { emailId: event.data.email_id },
        data: {
          complainedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return new Response("Email complained event received", { status: 200 });
    default:
      console.log("Unknown event received");
      return new Response("Unknown event received", { status: 200 });
  }
}
