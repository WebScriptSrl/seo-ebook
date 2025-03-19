"use server";

import { TestimonialType, UserReview } from "@/types";
import { ReviewState } from "@prisma/client";

import { ReviewWithUser } from "@/components/pricing/admin-reviews";

import { prisma } from "./db";

export const getUsersReviews = async (
  state: ReviewState,
): Promise<TestimonialType[]> => {
  const reviews = await prisma.review.findMany({
    where: {
      approved: state,
    },
    select: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      job: true,
      location: true,
      rating: true,
      comment: true,
      productName: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });

  if (!reviews) {
    return [] as TestimonialType[];
  }

  const handleData = reviews.map((review) => {
    return {
      name: review.user?.name,
      job: review.job,
      location: review.location,
      image: review.user?.image,
      review: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      product: review.product ? review.product.name : review.productName,
    };
  });

  return [...handleData] as TestimonialType[];
};

export const getUserReviews = async (userId: string): Promise<UserReview[]> => {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
    },
    select: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      id: true,
      job: true,
      productName: true,
      location: true,
      rating: true,
      approved: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          title: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!reviews) {
    return [];
  }

  const handleData = reviews.map((review) => {
    const reviewData = {
      id: review.id,
      name: review.user?.name,
      job: review.job,
      location: review.location,
      image: review.user?.image,
      review: review.comment,
      rating: review.rating,
      approved: review.approved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      product: review.product ? review.product.title : review.productName,
    };
    return reviewData;
  });

  return [...handleData] as UserReview[];
};

export const countReviews = async () => {
  try {
    return await prisma.review.count();
  } catch (error) {
    return null;
  }
};

export const countGroupedReviews = async (state: ReviewState) => {
  try {
    return await prisma.review.count({
      where: {
        approved: state,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getPaginatedReviews = async (
  page: number,
  limit: number,
): Promise<ReviewWithUser[]> => {
  const pageNum = page - 1;
  const reviews = await prisma.review.findMany({
    take: limit,
    skip: pageNum * limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      id: true,
      job: true,
      productName: true,
      location: true,
      rating: true,
      approved: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          title: true,
          name: true,
        },
      },
    },
  });

  if (!reviews) {
    return [];
  }

  const handleData = reviews.map((review) => {
    const reviewData = {
      id: review.id,
      name: review.user?.name,
      job: review.job,
      location: review.location,
      image: review.user?.image,
      review: review.comment,
      rating: review.rating,
      approved: review.approved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      product: review.product ? review.product.title : review.productName,
      email: review.user?.email,
    };
    return reviewData;
  });

  return [...handleData] as ReviewWithUser[];
};

export const getGroupedPaginatedReviews = async ({
  page,
  limit,
  state,
}: {
  page: number;
  limit: number;
  state: ReviewState;
}): Promise<ReviewWithUser[]> => {
  const pageNum = page - 1;
  const reviews = await prisma.review.findMany({
    where: {
      approved: state,
    },
    take: limit,
    skip: pageNum * limit,
    orderBy: {
      createdAt: "asc",
    },
    select: {
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      id: true,
      job: true,
      productName: true,
      location: true,
      rating: true,
      approved: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          title: true,
          name: true,
        },
      },
    },
  });

  if (!reviews) {
    return [];
  }

  const handleData = reviews.map((review) => {
    const reviewData = {
      id: review.id,
      name: review.user?.name,
      job: review.job,
      location: review.location,
      image: review.user?.image,
      review: review.comment,
      rating: review.rating,
      approved: review.approved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      product: review.product ? review.product.title : review.productName,
      email: review.user?.email,
    };
    return reviewData;
  });

  return [...handleData] as ReviewWithUser[];
};
