"use server";

import { prisma } from "@/lib/db";

export type DownloadData = {
  orderId: string;
  case: "download" | "update";
};

const handleDownload = async ({ data }: { data: DownloadData }) => {
  switch (data.case) {
    case "download":
      try {
        const orderDownload = await prisma.order.findUnique({
          where: {
            id: data.orderId,
          },
          select: {
            downloads: {
              where: {
                orderId: data.orderId,
              },
              select: {
                id: true,
                url: true,
                used: true,
                key: true,
                expires: true,
                downloadCount: true,
                updatedAt: true,
              },
            },
          },
        });

        const download = orderDownload?.downloads[0];

        if (!download) {
          throw new Error("Download not found");
        }

        const isExpired = new Date() > new Date(download.expires!);
        const isUsed = download.downloadCount > 0 || download.used;

        if (isExpired) {
          throw new Error(
            `Download link expired on ${new Date(download.expires!).toLocaleString()}`,
          );
        }

        if (isUsed) {
          throw new Error(
            `Download link already used on ${new Date(download.updatedAt!).toLocaleString()}`,
          );
        }

        return {
          url: download.url,
          key: download.key,
          isUsed,
        };
      } catch (error) {
        throw new Error(error.message);
      }

    case "update":
      try {
        const orderDownload = await prisma.order.findUnique({
          where: {
            id: data.orderId,
          },
          select: {
            downloads: {
              where: {
                orderId: data.orderId,
              },
              select: {
                id: true,
                used: true,
              },
            },
          },
        });

        const isUsed = orderDownload?.downloads[0].used;

        if (isUsed) return;

        await prisma.order.update({
          where: {
            id: data.orderId,
          },
          data: {
            downloads: {
              update: {
                where: {
                  orderId: data.orderId,
                },
                data: {
                  downloadCount: {
                    increment: 1,
                  },
                  used: true,
                  updatedAt: new Date(),
                },
              },
            },
          },
        });

        return {
          status: "success",
        };
      } catch (error) {
        throw new Error(error.message);
      }

    default:
      throw new Error("Invalid case");
  }
};

export { handleDownload };
