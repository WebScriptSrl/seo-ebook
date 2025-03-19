import {
  getDownloadFileSignedUrl,
  type GetDownloadFileSignedURL,
} from "@/lib/s3Utils";

export const downloadFileSignedUrl: GetDownloadFileSignedURL<
  { key: string },
  string
> = async ({ key }) => {
  return await getDownloadFileSignedUrl({ key });
};
