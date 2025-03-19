import { Resend } from "resend";
import { Webhook } from "svix";

import { env } from "@/env.mjs";

export const resend = new Resend(env.AUTH_RESEND_KEY);
export const webhook = new Webhook(env.RESEND_WEBHOOK_SECRET);
