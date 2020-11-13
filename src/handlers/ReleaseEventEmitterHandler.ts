import { DynamoDBStreamHandler } from "aws-lambda";
import {
  makeReleaseUpdateEventService,
  ReleaseUpdateEventTypes,
} from "../repositories/makeReleaseUpdateEventService";
import { makeReleaseRepository } from "../repositories/makeReleaseRepository";

const WAITING_THRESHOLD_TIME_MS = 2 * 24 * 60 * 60 * 1000;

export const handler: DynamoDBStreamHandler = async (event, context) => {
  const releaseRepository = makeReleaseRepository();
  const releaseEventUpdateService = makeReleaseUpdateEventService();

  const promises = event.Records.filter(
    (record) => record.eventName === "INSERT" || record.eventName === "MODIFY"
  )
    .map((record) => ({
      dynamoEventName: record.eventName,
      oldEntry: releaseRepository.decode(record.dynamodb?.OldImage),
      newEntry: releaseRepository.decode(record.dynamodb?.NewImage),
    }))
    .map(({ dynamoEventName, oldEntry, newEntry }) => {
      console.log("Received event for", { oldEntry, newEntry });
      const hasStatusChanged = oldEntry?.status !== newEntry?.status;
      const hasRolloutPercentChanged =
        oldEntry?.userFraction !== newEntry?.userFraction;

      const isReleaseWaitingForRollout =
        !hasStatusChanged &&
        !hasRolloutPercentChanged &&
        isUnchangedForTime(WAITING_THRESHOLD_TIME_MS);

      const isReleaseUpdated =
        newEntry?.status !== "completed" && hasRolloutPercentChanged;

      const isReleaseCompleted =
        newEntry?.status === "completed" && hasStatusChanged;

      const isReleaseAborted =
        newEntry?.status === "halted" && hasStatusChanged;

      const sendReleaseEvent = (type: ReleaseUpdateEventTypes) => {
        return releaseEventUpdateService.sendReleaseEvent({
          type,
          from: oldEntry,
          to: newEntry,
        });
      };

      if (isReleaseWaitingForRollout) {
        return sendReleaseEvent("NO_CHANGE");
      }

      if (isReleaseUpdated) {
        return sendReleaseEvent("RELEASE_UPDATED");
      }

      if (isReleaseCompleted) {
        return sendReleaseEvent("RELEASE_COMPLETE");
      }

      if (isReleaseAborted) {
        return sendReleaseEvent("RELEASE_ABORTED");
      }

      return Promise.resolve();
    });

  await Promise.all(promises as any);
};

const isUnchangedForTime = (time: number) => {
  return false;
};
