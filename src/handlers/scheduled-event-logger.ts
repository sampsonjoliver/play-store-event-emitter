import { ScheduledHandler } from "aws-lambda";
import { makePlayStoreRepository } from "../repositories/makePlayStoreRepository";

export const scheduledEventLoggerHandler: ScheduledHandler = async (
  event,
  context
) => {
  const packageName = "thePackageName";
  console.info(JSON.stringify(event));

  const client = makePlayStoreRepository();

  const tracks = await client.listTracks();

  console.log({ tracks });
};
