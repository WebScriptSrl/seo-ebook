"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ReviewState } from "@prisma/client";

import { prisma } from "@/lib/db";

export type ModerateReviewFormData = {
  id: string;
  comment: string;
  state: ReviewState;
  isApproved: boolean;
};

export async function moderateReview(
  data: ModerateReviewFormData,
  path: string,
) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (session.user.role !== "ADMIN") {
      throw new Error("Unauthorized to perform this action");
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

    await prisma.review.update({
      where: {
        id: data.id,
      },
      data: {
        comment: data.comment,
        approved: data.state,
        updatedAt: new Date(),
      },
    });

    revalidatePath(path, "page");
    revalidatePath("/admin", "page");
    revalidatePath("/admin/reviews", "page");
    revalidatePath("/", "page");
    revalidatePath("/dashboard", "page");
    revalidatePath("/dashboard/reviews", "page");
    return {
      status: "success",
      message: "Review updated successfully.",
    };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
