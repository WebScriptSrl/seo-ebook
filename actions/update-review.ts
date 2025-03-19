"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export type UpdateReviewFormData = {
  id: string;
  comment: string;
  rating: number;
  isApproved: boolean;
};

export async function updateReview(data: UpdateReviewFormData, path: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const review = await prisma.review.findUnique({
      where: {
        id: data.id,
      },
      select: {
        approved: true,
      },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.approved === "APPROVED") {
      await prisma.review.update({
        where: {
          id: data.id,
        },
        data: {
          rating: data.rating,
          comment: data.comment,
          approved: "PENDING",
          updatedAt: new Date(),
        },
      });

      revalidatePath(path, "page");
      return {
        status: "success",
        message: "Review updated successfully and sent for moderation!",
      };
    }

    await prisma.review.update({
      where: {
        id: data.id,
      },
      data: {
        comment: data.comment,
        rating: data.rating,
        updatedAt: new Date(),
      },
    });

    revalidatePath(path, "page");
    revalidatePath("/admin", "page");
    revalidatePath("/admin/reviews", "page");
    revalidatePath("/", "page");
    revalidatePath("/dashboard", "page");
    revalidatePath("/dashboard/reviews", "page");
    return { status: "success", message: "Review updated successfully." };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
