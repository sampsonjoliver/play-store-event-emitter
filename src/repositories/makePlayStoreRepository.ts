import { androidpublisher_v3, google } from "googleapis";
import { S3 } from "aws-sdk";
import fs from "graceful-fs";
import { AuthPlus } from "googleapis/build/src/googleapis";

const PLAY_STORE_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const CREDENTIALS_FILE_NAME = "credentials.json";
const CREDENTIALS_FILE_PATH = "/tmp";

let api: androidpublisher_v3.Androidpublisher;
const makePlayStoreApi = async () => {
  if (!api) {
    await fetchCredentialsFile();

    console.log("Starting create GoogleAuth");
    const auth = new google.auth.GoogleAuth({
      keyFile: `${CREDENTIALS_FILE_PATH}/${CREDENTIALS_FILE_NAME}`,
      scopes: [PLAY_STORE_SCOPE],
    });

    google.options({ auth });
    console.log("Finished create GoogleAuth");

    api = google.androidpublisher("v3");
  }
  return api;
};

export const makePlayStoreRepository = () => {
  const packageName = process.env.PackageName as string;

  const startEdit = async () => {
    const api = await makePlayStoreApi();
    const edit = await api.edits.insert({ packageName });

    return {
      api,
      editId: edit.data.id || "",
    };
  };
  const closeEdit = (editId: string) => {
    return api.edits.commit({ editId, packageName });
  };

  const listTracks = async () => {
    console.log("Started listTracks");
    const { api, editId } = await startEdit();

    const tracks = await api.edits.tracks.list({
      editId,
      packageName,
    });

    await closeEdit(editId);
    console.log("Finished listTracks");

    return tracks;
  };

  return {
    listTracks,
  };
};

const fetchCredentialsFile = async () => {
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
  fs.writeFileSync(
    `${CREDENTIALS_FILE_PATH}/${CREDENTIALS_FILE_NAME}`,
    credentialsBody
  );
  console.log(`Finished writing credentials to ./${CREDENTIALS_FILE_NAME}`);
};
