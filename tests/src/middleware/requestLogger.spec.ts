import { Config } from "../../../src/config/config";
import { Strings } from "../../../src/config/strings";
import { RequestLogger } from "../../../src/middleware/requestLogger";
import { Logger } from "../../../src/utils/logger";
import { MockLogger } from "../../__mocks/mockLogger";

describe("RequestLogger middleware", () => {
  let strings: Strings;
  let config: Config;
  let logger: Logger;

  beforeAll(async () => {
    strings = new Strings();

    config = new Config({
      logger: {
        logTransports: ["console"],
        consoleLogLevel: "error",
      },
    });

    logger = new MockLogger({
      databasePool: {} as any,
      databaseName: config.database,
      ...config.logger,
    });
  });

  describe("pre middleware", () => {
    test("Should log incoming requests.", () => {
      const req = {
        url: "some/url",
        params: {
          tableID: "65",
        },
        connection: {
          remoteAddress: "192.168.0.1",
        },
      };
      let fn: (req: any, res: any, next: any) => undefined;
      const server = {
        pre: (middleware: any) => {
          fn = middleware;
        },
      } as any;
      const next = jest.fn();
      let message: string;
      logger.info = (loggedMessage) => {
        message = loggedMessage;
      };
      const reqLogger = new RequestLogger(server, logger, strings);

      fn(req, {}, next);

      expect(message).toEqual(
        strings.incomingRequest.replace(
          ":requestData:",
          JSON.stringify({
            url: req.url,
            params: req.params,
            ip: req.connection.remoteAddress,
          })
        )
      );
      expect(next.mock.calls.length).toBe(1);
    });
  });
});
