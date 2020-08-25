import { Config } from "../../../src/config/config";
import { Strings } from "../../../src/config/strings";
import { Cors } from "../../../src/middleware/cors";
import { Logger } from "../../../src/utils/logger";
import { MockLogger } from "../../__mocks/mockLogger";

describe("CORS middleware", () => {
  let strings: Strings;
  let config: Config;
  let logger: Logger;

  beforeAll(async () => {
    strings = new Strings();

    const spaceballsAccessCodesToDruidia = "12345";
    config = new Config({
      authPassword: spaceballsAccessCodesToDruidia,
      authUsername: "test",
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
    test("Should not set response cors headers, but go on to next response handler when request origin header does not match.", () => {
      const req = {
        headers: {
          origin: "http://ummatchedhost:3000",
        },
      };
      const headers: { name: string; value: string }[] = [];
      const res = {
        header: (headerName: string, headerValue: string) => {
          headers.push({ name: headerName, value: headerValue });
        },
      };
      let fn: (req: any, res: any, next: any) => undefined;
      const server = {
        pre: (middleware: any) => {
          fn = middleware;
        },
      } as any;
      const next = jest.fn();
      const cors = new Cors(server, config, logger, strings);

      fn(req, res, next);

      expect(headers).toEqual([]);
      expect(next.mock.calls.length).toBe(1);
    });

    test("Should set response cors headers and send a 200 response and go on to next response handler when request origin header does match.", () => {
      const req = {
        headers: {
          origin: "http://localhost:3000",
        },
      };
      const headers: { name: string; value: string }[] = [];
      const res = {
        header: (headerName: string, headerValue: string) => {
          headers.push({ name: headerName, value: headerValue });
        },
      };
      let fn: (req: any, res: any, next: any) => undefined;
      const server = {
        pre: (middleware: any) => {
          fn = middleware;
        },
      } as any;
      const next = jest.fn();
      const cors = new Cors(server, config, logger, strings);

      fn(req, res, next);

      expect(headers).toEqual([
        {
          name: "Access-Control-Allow-Origin",
          value: "http://localhost:3000",
        },
        {
          name: "Access-Control-Allow-Headers",
          value: "Authorization",
        },
      ]);
      expect(next.mock.calls.length).toBe(1);
    });
  });
});
