"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function deleteReviews(data: string[], path: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const { count } = await prisma.review.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    });

    if (count !== data.length) {
      return { status: "error", message: "Invalid reviews" };
    }

    revalidatePath(path, "page");
    return { status: "success", message: "Reviews deleted successfully" };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
