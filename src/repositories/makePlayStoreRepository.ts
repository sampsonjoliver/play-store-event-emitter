import { makeAndroidPublisherApi } from "./makeAndroidPublisherApi";
import { Release } from "./makeReleaseRepository";

import { memoize } from "../memoize";

type PlayStoreRepositoryProps = {
  packageName: string;
};

export const makePlayStoreRepository = ({
  packageName,
}: PlayStoreRepositoryProps) => {
  const listTrackReleases = async () => {
    console.log("Started listTracks");

    const api = await makeAndroidPublisherApi();
    const edit = makePlayStoreEdit({ packageName });
    const editId = await edit.open();

    const tracksResponse = await api.edits.tracks.list({
      editId,
      packageName,
    });

    const tracks = tracksResponse.data.tracks ?? [];

    const trackReleases = tracks
      .map((track) => {
        const trackName = track.track;
        const releaseInfo = track.releases?.[0];

        if (!releaseInfo?.name || releaseInfo.status === "draft") {
          return undefined;
        }

        const versionCodes = releaseInfo.versionCodes?.join(",");

        const activeRelease =
          releaseInfo &&
          ({
            releaseId: `${trackName}-${releaseInfo.name}-${versionCodes}`,
            status: releaseInfo.status,
            userFraction: releaseInfo.userFraction,
            versionCode: versionCodes,
            versionName: releaseInfo.name,
            releaseTrack: trackName,
          } as Release);

        return activeRelease;
      })
      .filter((it) => it !== undefined) as Release[];

    console.log("Finished listTracks");

    return trackReleases;
  };

  return {
    listTrackReleases: listTrackReleases,
  };
};

export const makePlayStoreEdit = memoize(
  ({ packageName }: PlayStoreRepositoryProps) => {
    let openEditId: string | undefined;

    const open = async () => {
      const api = await makeAndroidPublisherApi();

      if (openEditId) {
        return openEditId;
      }

      const edit = await api.edits.insert({ packageName });

      openEditId = edit.data.id || "";
      return openEditId;
    };

    const close = async (editId: string) => {
      const api = await makeAndroidPublisherApi();
      const result = await api.edits.commit({ editId, packageName });
      openEditId = undefined;
      return result;
    };

    return {
      open,
      close,
    };
  }
);
