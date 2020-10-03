import { DynamoDBStreamHandler } from "aws-lambda";
import { makeReleaseUpdateEventService } from "../repositories/makeReleaseUpdateEventService";
import { makeReleaseRepository } from "../repositories/makeReleaseRepository";

const WAITING_THRESHOLD_TIME_MS = 2 * 24 * 60 * 60 * 1000;

export const releaseNotificationHandler: DynamoDBStreamHandler = async (
  event,
  context
) => {
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

      if (isReleaseWaitingForRollout) {
        return releaseEventUpdateService.sendReleaseEvent({
          type: "RELEASE_WAITING",
          from: oldEntry,
          to: newEntry,
        });
      }

      if (isReleaseUpdated) {
        return releaseEventUpdateService.sendReleaseEvent({
          type: "RELEASE_UPDATED",
          from: oldEntry,
          to: newEntry,
        });
      }

      if (isReleaseCompleted) {
        return releaseEventUpdateService.sendReleaseEvent({
          type: "RELEASE_COMPLETE",
          from: oldEntry,
          to: newEntry,
        });
      }

      if (isReleaseAborted) {
        return releaseEventUpdateService.sendReleaseEvent({
          type: "RELEASE_ABORTED",
          from: oldEntry,
          to: newEntry,
        });
      }

      return Promise.resolve();
    });

  await Promise.all(promises as any);
};

const isUnchangedForTime = (time: number) => {
  return false;
};
