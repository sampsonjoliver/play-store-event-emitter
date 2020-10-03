import { DynamoDB } from "aws-sdk";
import { Table, Entity } from "dynamodb-toolbox";

const DocumentClient = new DynamoDB.DocumentClient();

const ReleasesTable = new Table({
  name: process.env.ReleaseRepositoryTableName || "",
  partitionKey: "releaseName",
  DocumentClient,
});

const ReleaseEntity = new Entity<Release>({
  name: "Release",
  attributes: {
    releaseId: {
      partitionKey: true,
      type: "string",
    },
    status: "string",
    userFraction: "number",
    versionCode: "string",
    versionName: "string",
    releaseTrack: "string",
  },
  table: ReleasesTable,
});

export type Release = {
  releaseId: string;
  status: string;
  userFraction: number;
  versionCode: string;
  versionName: string;
  releaseTrack: string;
};

export const makeReleaseRepository = () => {
  return {
    put: (release: Release) => {
      console.log(`Writing ${release.releaseId} to ${ReleasesTable.name}`);
      console.log(release);
      return ReleaseEntity.put(release);
    },
  };
};
