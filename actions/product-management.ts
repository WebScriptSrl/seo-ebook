"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export type ProductFormData = {
  id: string;
  title: string;
  slug?: string;
  name: string;
  description: string;
  key: string;
  price: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  image?: string;

  stripePriceId?: string;
  stripeProductId?: string;

  stripeCouponId?: string;
  stripePromoCode?: string;
  stripePromoCodeExpires?: Date;
};

export async function manageProducts(data: ProductFormData, path: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (session.user.role !== "ADMIN") {
      throw new Error("Unauthorized to perform this action");
    }

    await prisma.product.upsert({
      where: {
        id: data.id,
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    revalidatePath(path, "page");
    revalidatePath("/admin", "page");
    revalidatePath("/admin/products", "page");

    return {
      status: "success",
      message: `Product ${data.id ? "updated" : "created"} successfully.`,
    };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
