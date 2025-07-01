import { S3Client } from "@aws-sdk/client-s3";

// Use the region from environment variables to create proper endpoint
// Mumbai (ap-south-1) requires special handling
const region = process.env.AWS_REGION || "us-east-1";
const useRegionalEndpoint = region !== "us-east-1";

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Only add the endpoint for non-us-east-1 regions for compatibility
  ...(useRegionalEndpoint && {
    endpoint: `https://s3.${region}.amazonaws.com`,
  }),
});

export default s3Client;
