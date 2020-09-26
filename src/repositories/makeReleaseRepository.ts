import { DynamoDB } from "aws-sdk";
import { Table, Entity } from "dynamodb-toolbox";

const DocumentClient = new DynamoDB.DocumentClient();

const ReleasesTable = new Table({
  name: process.env.ReleaseRepositoryTableName || "",
  partitionKey: "releaseTrack",
  DocumentClient,
});

const ReleaseEntity = new Entity<Release>({
  name: "Release",
  attributes: {
    releaseTrack: {
      partitionKey: true,
      type: "string",
    },
    releaseName: "string",
    status: "string",
    userFraction: "number",
    versionCode: "string",
    versionName: "string",
  },
  table: ReleasesTable,
});

export type Release = {
  releaseTrack: string;
  releaseName: string;
  status: string;
  versionName: string;
  versionCode: string;
  userFraction: number;
};

export const makeReleaseRepository = () => {
  return {
    put: (release: Release) => {
      console.log(`Writing ${release.releaseName} to ${ReleasesTable.name}`);
      console.log(release);
      return ReleaseEntity.put(release);
    },
  };
};
