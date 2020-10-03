import { EventBridge } from "aws-sdk";
import { memoize } from "../memoize";

import { Release } from "./makeReleaseRepository";

export type ReleaseUpdateEventTypes =
  | "RELEASE_UPDATED"
  | "RELEASE_COMPLETE"
  | "RELEASE_WAITING"
  | "RELEASE_ABORTED";

export type ReleaseUpdateEvent = {
  type: ReleaseUpdateEventTypes;
  from?: Release;
  to?: Release;
};

export const makeReleaseUpdateEventService = memoize(() => {
  const eventbridge = new EventBridge();
  const sendReleaseEvent = (releaseUpdateEvent: ReleaseUpdateEvent) => {
    const eventBridgePayload = JSON.stringify(releaseUpdateEvent);

    return eventbridge
      .putEvents({
        Entries: [
          {
            Detail: eventBridgePayload,
          },
        ],
      })
      .promise();
  };

  return { sendReleaseEvent };
});
