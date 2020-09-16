const mockInsert = jest.fn();
const mockList = jest.fn();
jest.mock("../repositories/makePlayStoreRepository", () => ({
  makePlayStoreRepository: () => ({
    listTracks: mockList,
  }),
}));

import * as scheduledEventLogger from "./scheduled-event-logger";

describe("Test for sqs-payload-logger", function () {
  it("Verifies the payload is logged", async () => {
    mockInsert.mockResolvedValue({
      data: {
        id: "theEditId",
      },
    });

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

    await scheduledEventLogger.scheduledEventLoggerHandler(payload, null);

    expect(mockList).toHaveBeenCalled();
  });
});
