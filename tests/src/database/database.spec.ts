import { Config } from "../../../src/config/config";
import { Database } from "../../../src/database/database";
import { Services } from "../../../src/modules/services";
import { MockLogger } from "../../__mocks/mockLogger";

describe("Database", () => {
  let services: Services;
  let database: Database;

  beforeEach(async () => {
    const config = new Config({
      logger: {
        logTransports: ["console"],
        consoleLogLevel: "error",
      },
    });

    const logger = new MockLogger({
      databasePool: {} as any,
      databaseName: config.database,
      ...config.logger,
    });

    services = new Services(config, undefined, logger);

    await services.boot();

    database = services.getDatabase();
  });

  afterEach(async (done) => {
    await database.stop(done);
  });

  describe("Start", () => {
    test("Should connect and call the callback", async (done) => {
      const mockCallback = jest.fn();

      try {
        await database.start(mockCallback);

        setTimeout(() => {
          expect(mockCallback.mock.calls.length).toBe(1);
          done();
        }, 100);
      } catch (error) {
        throw error;
      }
    });
  });

  describe("Stop", () => {
    test("Should disconnect and call the callback", async (done) => {
      const mockCallback = jest.fn();

      try {
        await database.stop(mockCallback);

        setTimeout(() => {
          expect(mockCallback.mock.calls.length).toBe(1);
          done();
        }, 100);
      } catch (error) {
        throw error;
      }
    });
  });
});
