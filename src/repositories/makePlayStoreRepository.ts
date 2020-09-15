import { google } from "googleapis";

const PLAY_STORE_SCOPE = "https://www.googleapis.com/auth/androidpublisher";

export const makePlayStoreRepository = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "/path/to/your-secret-key.json",
    scopes: [PLAY_STORE_SCOPE],
  });

  google.options({ auth });

  return google.androidpublisher("v3");
};
