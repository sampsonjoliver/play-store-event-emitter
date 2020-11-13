import { EventBridgeEvent, Handler } from "aws-lambda";
import { makePlayStoreRepository } from "../repositories/makePlayStoreRepository";
import { makeReleaseRepository } from "../repositories/makeReleaseRepository";

export const handler: Handler<
  EventBridgeEvent<"Scheduled Event", any>,
  any
> = async (event, context) => {
  const packageName = process.env.PackageName as string;

  const playStore = makePlayStoreRepository({ packageName });
  const releaseDb = makeReleaseRepository();

  const trackReleases = await playStore.listTrackReleases();

  if (trackReleases.length === 0) {
    console.log("Missing data", trackReleases);
    return;
  }

  const promises = trackReleases.map((release) => {
    return releaseDb.put(release);
  });

  const results = await Promise.all(promises);
  console.log(results);
};
