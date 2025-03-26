"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function deleteProducts(data: string[], path: string) {
  try {
    const session = await auth();

    if (session?.user.role !== "ADMIN") {
      throw new Error("Unauthorized to perform this action");
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
    return {
      status: "success",
      message: `${count} ${count === 1 ? "product" : "products"} deleted successfully!`,
    };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
