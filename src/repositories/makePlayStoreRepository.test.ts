const mockGoogleAuth = jest.fn();
const mockGoogleOptions = jest.fn();
const mockPlayStoreInsert = jest.fn();
const mockPlayStoreCommit = jest.fn();
const mockPlayStoreList = jest.fn();
jest.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: function (...opts) {
        return mockGoogleAuth(...opts);
      },
    },
    options: (...opts) => mockGoogleOptions(...opts),
    androidpublisher: function () {
      return {
        edits: {
          insert: mockPlayStoreInsert,
          commit: mockPlayStoreCommit,
          tracks: {
            list: mockPlayStoreList,
          },
        },
      };
    },
  },
}));

const mockS3GetObject = jest.fn();
jest.mock("aws-sdk", () => ({
  S3: function () {
    return {
      getObject: (opts) => ({
        promise: () => mockS3GetObject(opts),
      }),
    };
  },
}));

const mockWriteFileSync = jest.fn();
jest.mock("graceful-fs", () => ({
  writeFileSync: (...opts) => mockWriteFileSync(...opts),
}));

import { makePlayStoreRepository } from "./makePlayStoreRepository";

describe("makePlayStoreRepository", function () {
  describe("#listTrackReleases", () => {
    beforeAll(() => {
      mockS3GetObject.mockResolvedValue({
        Body: "theCredentialsFileContents",
      });

      mockPlayStoreInsert.mockResolvedValue({ data: { id: "theEditId" } });
      mockPlayStoreList.mockResolvedValue({
        data: {
          tracks: [
            {
              track: "theTrackName",
              releases: [
                {
                  name: "theReleaseName",
                  status: "theStatus",
                  userFraction: "theUserFraction",
                  versionCodes: ["theVersionCode"],
                },
              ],
            },
          ],
        },
      });
      mockGoogleAuth.mockReturnValue("theGoogleAuth");
    });

    it("Should list the track release", async () => {
      const playStoreRepo = makePlayStoreRepository({
        packageName: "thePackageName",
      });

      const trackReleases = await playStoreRepo.listTrackReleases();

      expect(mockS3GetObject).toHaveBeenCalledWith({
        Bucket: "",
        Key: "credentials.json",
      });
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        "/tmp/credentials.json",
        "theCredentialsFileContents"
      );

      expect(mockGoogleAuth).toHaveBeenCalledWith({
        keyFile: "/tmp/credentials.json",
        scopes: ["https://www.googleapis.com/auth/androidpublisher"],
      });

      expect(mockPlayStoreInsert).toHaveBeenCalledWith({
        packageName: "thePackageName",
      });

      expect(trackReleases).toEqual([
        {
          releaseId: "theTrackName-theReleaseName-theVersionCode",
          status: "theStatus",
          userFraction: "theUserFraction",
          versionCode: "theVersionCode",
          versionName: "theReleaseName",
          releaseTrack: "theTrackName",
        },
      ]);
    });
  });
});
