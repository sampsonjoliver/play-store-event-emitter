import { google } from "googleapis";
import { S3 } from "aws-sdk";
import { writeFileSync } from "graceful-fs";

import { memoize } from "../memoize";

export const PLAY_STORE_SCOPE =
  "https://www.googleapis.com/auth/androidpublisher";

export const CREDENTIALS_FILE_NAME = "credentials.json";
export const CREDENTIALS_FILE_PATH = "/tmp";

export const makeAndroidPublisherApi = memoize(async () => {
  await fetchAndSaveCredentialsFile();

  console.log("Starting create GoogleAuth");
  const auth = new google.auth.GoogleAuth({
    keyFile: `${CREDENTIALS_FILE_PATH}/${CREDENTIALS_FILE_NAME}`,
    scopes: [PLAY_STORE_SCOPE],
  });

  google.options({ auth });
  console.log("Finished create GoogleAuth");

  const api = google.androidpublisher("v3");

  console.log("Finished create google api");

  return api;
});

export const fetchAndSaveCredentialsFile = async () => {
  console.log("Started fetch credentials body");

  const s3 = new S3();
  const credentials = await s3
    .getObject({
      Bucket: process.env.ConfigurationBucketName || "",
      Key: CREDENTIALS_FILE_NAME,
    })
    .promise();

  const credentialsBody = credentials.Body?.toString();
  console.log("Finished fetch credentials body");

  console.log(`Started writing credentials to ./${CREDENTIALS_FILE_NAME}`);
  writeFileSync(
    `${CREDENTIALS_FILE_PATH}/${CREDENTIALS_FILE_NAME}`,
    credentialsBody
  );
  console.log(`Finished writing credentials to ./${CREDENTIALS_FILE_NAME}`);
};
