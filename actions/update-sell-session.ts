"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { SellSession } from "@prisma/client";

import { prisma } from "@/lib/db";
import { sellSessionSchema } from "@/lib/validations/sell-session";

export type FormData = {
  name: string;
  sellStop?: boolean;
  showBanner?: boolean;
  bannerTitle?: string;
  description?: string;
};

export async function updateSellSession(data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const { name, sellStop, showBanner, bannerTitle, description } =
      sellSessionSchema.parse(data);

    // Update the sell session.
    await prisma.sellSession.upsert({
      where: {
        name: name,
      },
      create: {
        name: name,
        sellStop: sellStop,
        showBanner: showBanner,
        bannerTitle: bannerTitle,
        description: description,
      },
      update: {
        sellStop: sellStop,
        showBanner: showBanner,
        bannerTitle: bannerTitle,
        description: description,
      },
    });

    revalidatePath("/pricing", "page");
    revalidatePath("/admin/settings", "page");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
