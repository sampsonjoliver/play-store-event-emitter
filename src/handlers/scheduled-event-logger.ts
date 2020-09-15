import { ScheduledHandler } from "aws-lambda";
import { makePlayStoreRepository } from "../repositories/makePlayStoreRepository";

/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */
export const scheduledEventLoggerHandler: ScheduledHandler = async (
  event,
  context
) => {
  const packageName = "thePackageName";
  console.info(JSON.stringify(event));

  const client = makePlayStoreRepository();

  const edit = await client.edits.insert({ packageName });
  const editId = edit.data.id || "";

  const tracks = await client.edits.tracks.list({
    editId: editId,
    packageName,
  });

  console.log({ tracks });
};
