import { EventBridge } from "aws-sdk";
import { memoize } from "../memoize";

import { Release } from "./makeReleaseRepository";

export type ReleaseUpdateEventTypes =
  | "RELEASE_UPDATED"
  | "RELEASE_COMPLETE"
  | "NO_CHANGE"
  | "RELEASE_ABORTED";

export type ReleaseUpdateEvent = {
  type: ReleaseUpdateEventTypes;
  from?: Release;
  to?: Release;
};

export const makeReleaseUpdateEventService = memoize(() => {
  const eventbridge = new EventBridge();
  const sendReleaseEvent = (releaseUpdateEvent: ReleaseUpdateEvent) => {
    console.log("Emitting event: ", {
      releaseUpdateEvent,
    });
    const eventBridgePayload = JSON.stringify(releaseUpdateEvent);

    return eventbridge
      .putEvents({
        Entries: [
          {
            Detail: eventBridgePayload,
            EventBusName: process.env.EventBusName,
          },
        ],
      })
      .promise();
  };

  return { sendReleaseEvent };
});
