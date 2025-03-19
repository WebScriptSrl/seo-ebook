import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Generic type for the function
export type GetDownloadFileSignedURL<Params, Response> = (
  params: Params,
) => Promise<Response>;

export const expiresIn = 6; // Hours to expire - number

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getDownloadFileSignedUrl = async ({
  key,
  expire = expiresIn,
}: {
  key: string;
  expire?: number;
}) => {
  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };
  const command = new GetObjectCommand(s3Params);
  return await getSignedUrl(s3Client, command, {
    expiresIn: 3600 * expire,
  });
};
