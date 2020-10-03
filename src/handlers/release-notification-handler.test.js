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

const newPartialRollout = {
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

const haltedRollout = {
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

import { releaseNotificationHandler } from "./release-notification-handler";

describe("ReleaseNotificationHandler", function () {
  describe("Given a release has updated its rollout percent", () => {
    it("Should send an update event", async () => {
      const eventData = createStreamEvent([updatedPartialRolloutEvent]);

      const result = await releaseNotificationHandler(eventData, {});

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
});
