const mockPlayStoreListTrackReleases = jest.fn();
jest.mock("../repositories/makePlayStoreRepository", () => ({
  makePlayStoreRepository: () => ({
    listTrackReleases: mockPlayStoreListTrackReleases,
  }),
}));

const mockTablePut = jest.fn();
jest.mock("../repositories/makeReleaseRepository", () => ({
  makeReleaseRepository: () => ({
    put: mockTablePut,
  }),
}));

import { handler } from "./PlayStoreObserverHandler";

describe("ScheduledPlayStoreScraper", function () {
  it("Should scrape the play store and write snapshot to table", async () => {
    mockPlayStoreListTrackReleases.mockResolvedValue([
      "aRelease",
      "anotherRelease",
    ]);
    mockTablePut.mockResolvedValue({});

    var payload = {
      id: "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
      "detail-type": "Scheduled Event",
      source: "aws.events",
      account: "",
      time: "1970-01-01T00:00:00Z",
      region: "us-west-2",
      resources: ["arn:aws:events:us-west-2:123456789012:rule/ExampleRule"],
      detail: {},
    };

    await handler(payload, null);

    expect(mockPlayStoreListTrackReleases).toHaveBeenCalled();
    expect(mockTablePut).toHaveBeenCalledWith("aRelease");
    expect(mockTablePut).toHaveBeenCalledWith("anotherRelease");
  });
});
