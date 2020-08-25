import { Config } from "../../../src/config/config";
import { Strings } from "../../../src/config/strings";
import { Database } from "../../../src/database/database";

let database: Database;

afterAll(async (done) => {
  await database.stop(done);
});

describe("Database", () => {
  beforeEach(async () => {
    const config = new Config({
      logger: {
        logTransports: ["console"],
        consoleLogLevel: "error",
      },
    });

    database = new Database(config, new Strings());
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
