const mockEventBridgePutEvents = jest.fn();
jest.mock("aws-sdk", () => {
  const actual = jest.requireActual("aws-sdk");
  return {
    ...actual,
    EventBridge: function () {
      return {
        putEvents: (...opts) => ({
          promise: () => mockEventBridgePutEvents(...opts),
        }),
      };
    },
  };
});

const createStreamEvent = (records) => ({
  Records: records,
});

const newFullRolloutEvent = {
  eventName: "INSERT",
  dynamodb: {
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "completed",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
    },
  },
};

const updatedFullRolloutEvent = {
  eventName: "MODIFY",
  dynamodb: {
    OldImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.9,
      },
    },
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "completed",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
    },
  },
};

const updatedPartialRolloutEvent = {
  eventName: "MODIFY",
  dynamodb: {
    OldImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.2,
      },
    },
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.5,
      },
    },
  },
};

const unchangedPartialRolloutEvent = {
  eventName: "MODIFY",
  dynamodb: {
    OldImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.2,
      },
    },
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.2,
      },
    },
  },
};

const unchangedCompletedRolloutEvent = {
  eventName: "MODIFY",
  dynamodb: {
    OldImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "complete",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
    },
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "complete",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
    },
  },
};

const newPartialRollout = {
  eventName: "INSERT",
  dynamodb: {
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.2,
      },
    },
  },
};

const haltedRollout = {
  eventName: "INSERT",
  dynamodb: {
    OldImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "inProgress",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.2,
      },
    },
    NewImage: {
      _ct: {
        S: "2020-10-03T11:33:59.254Z",
      },
      _et: {
        S: "Release",
      },
      _md: {
        S: "2020-10-03T11:33:59.254Z",
      },
      releaseId: {
        S: "alpha-0.1-1",
      },
      releaseTrack: {
        S: "alpha",
      },
      status: {
        S: "halted",
      },
      versionCode: {
        S: "1",
      },
      versionName: {
        S: "0.1",
      },
      userFraction: {
        N: 0.2,
      },
    },
  },
};

const deletedEvent = {
  eventName: "REMOVE",
  dynamodb: {
    OldImage: {
      Message: {
        S: "This item has changed",
      },
      Id: {
        N: "101",
      },
    },
  },
};

import { handler } from "./ReleaseEventEmitterHandler";

describe("ReleaseNotificationHandler", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a new release has gone to full rollout", () => {
    const eventData = createStreamEvent([newFullRolloutEvent]);

    it("Should send an RELEASE_COMPLETE update event", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).toHaveBeenCalled();
      const sentEvent = JSON.parse(
        mockEventBridgePutEvents.mock.calls[0][0].Entries[0].Detail
      );
      expect(sentEvent).toMatchObject({
        type: "RELEASE_COMPLETE",
        to: {
          releaseId: "alpha-0.1-1",
          status: "completed",
        },
      });
    });
  });

  describe("Given a release has updated its rollout percent", () => {
    const eventData = createStreamEvent([updatedPartialRolloutEvent]);

    it("Should send an RELEASE_UPDATED update event", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).toHaveBeenCalled();
      const sentEvent = JSON.parse(
        mockEventBridgePutEvents.mock.calls[0][0].Entries[0].Detail
      );
      expect(sentEvent).toMatchObject({
        type: "RELEASE_UPDATED",
        from: {
          releaseId: "alpha-0.1-1",
          status: "inProgress",
          userFraction: 0.2,
        },
        to: {
          releaseId: "alpha-0.1-1",
          status: "inProgress",
          userFraction: 0.5,
        },
      });
    });
  });

  describe("Given a release has been updated to a full rollout", () => {
    const eventData = createStreamEvent([updatedFullRolloutEvent]);

    it("Should send an RELEASE_COMPLETE update event", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).toHaveBeenCalled();
      const sentEvent = JSON.parse(
        mockEventBridgePutEvents.mock.calls[0][0].Entries[0].Detail
      );
      expect(sentEvent).toMatchObject({
        type: "RELEASE_COMPLETE",
        to: {
          releaseId: "alpha-0.1-1",
          status: "completed",
        },
      });
    });
  });

  describe("Given a release has not changed its rollout percent", () => {
    const eventData = createStreamEvent([unchangedPartialRolloutEvent]);

    it("Should do nothing", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).not.toHaveBeenCalled();
    });
  });

  describe("Given a completed release has not changed", () => {
    const eventData = createStreamEvent([unchangedCompletedRolloutEvent]);

    it("Should do nothing", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).not.toHaveBeenCalled();
    });
  });

  describe("Given a new release has been partially rolled out", () => {
    const eventData = createStreamEvent([newPartialRollout]);

    it("Should send an RELEASE_UPDATED update event", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).toHaveBeenCalled();
      const sentEvent = JSON.parse(
        mockEventBridgePutEvents.mock.calls[0][0].Entries[0].Detail
      );
      expect(sentEvent).toMatchObject({
        type: "RELEASE_UPDATED",
        to: {
          releaseId: "alpha-0.1-1",
          status: "inProgress",
          userFraction: 0.2,
        },
      });
    });
  });

  describe("Given a release has been halted", () => {
    const eventData = createStreamEvent([haltedRollout]);

    it("Should send an update event", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).toHaveBeenCalled();
      const sentEvent = JSON.parse(
        mockEventBridgePutEvents.mock.calls[0][0].Entries[0].Detail
      );
      expect(sentEvent).toMatchObject({
        type: "RELEASE_ABORTED",
        from: {
          releaseId: "alpha-0.1-1",
          status: "inProgress",
          userFraction: 0.2,
        },
        to: {
          releaseId: "alpha-0.1-1",
          status: "halted",
          userFraction: 0.2,
        },
      });
    });
  });

  describe("Given a release has been deleted", () => {
    const eventData = createStreamEvent([deletedEvent]);

    it("Should do nothing at all", async () => {
      await handler(eventData, {});

      expect(mockEventBridgePutEvents).not.toHaveBeenCalled();
    });
  });
});
