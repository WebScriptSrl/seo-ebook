"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { reviewSchema } from "@/lib/validations/review";

export type ReviewFormData = {
  userId: string;
  product: string;
  job: string;
  location: string;
  rating: number;
  comment: string;
};

export async function addReview(data: ReviewFormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const { userId, job, location, rating, comment } = reviewSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: {
        name: data.product.toLowerCase(),
      },
      select: {
        id: true,
        title: true,
      },
    });

    await prisma.review.create({
      data: {
        userId,
        productId: product ? product.id : null,
        productName: product ? product.title : data.product,
        job,
        location,
        rating,
        comment,
      },
    });

    revalidatePath("/dashboard/reviews");
    return { status: "success", message: "Review added successfully" };
  } catch (error) {
    console.error("Error adding review", error);
    return { status: "error", message: error.message };
  }
}
