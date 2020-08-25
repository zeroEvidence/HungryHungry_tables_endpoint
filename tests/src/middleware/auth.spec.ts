import { Config } from "../../../src/config/config";
import { Strings } from "../../../src/config/strings";
import { Auth } from "../../../src/middleware/auth";
import { MockLogger } from "../../__mocks/mockLogger";

describe("Authentication middleware", () => {
  let auth: Auth;
  let strings: Strings;

  beforeAll(async () => {
    strings = new Strings();

    const spaceballsAccessCodesToDruidia = "12345";
    const config = new Config({
      authPassword: spaceballsAccessCodesToDruidia,
      authUsername: "test",
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
    const server = {
      use: (...args) => undefined,
    } as any;

    auth = new Auth(server, config, logger, strings);
  });

  describe("authorisation", () => {
    test("Should not authorise when given wrong username", () => {
      const req = {
        authorization: {
          basic: {
            username: "wrongUser",
            password: "12345",
          },
        },
        connection: {
          remoteAddress: "localhost",
        },
      };
      let sentMessage: any;
      const res = {
        send: (message) => {
          sentMessage = message;
        },
      };
      let goToNextResponseHandler: boolean;
      const next = (goOn) => {
        goToNextResponseHandler = goOn;
      };

      auth.authorisation(req as any, res as any, next as any);

      expect(sentMessage).toEqual({
        code: 401,
        message: strings.unauthorized,
      });
      expect(goToNextResponseHandler).toEqual(false);
    });

    test("Should not authorise when given wrong password", () => {
      const req = {
        authorization: {
          basic: {
            username: "test",
            password: "abc123",
          },
        },
        connection: {
          remoteAddress: "localhost",
        },
      };
      let sentMessage: any;
      const res = {
        send: (message) => {
          sentMessage = message;
        },
      };
      let goToNextResponseHandler: boolean;
      const next = (goOn) => {
        goToNextResponseHandler = goOn;
      };

      auth.authorisation(req as any, res as any, next as any);

      expect(sentMessage).toEqual({
        code: 401,
        message: strings.unauthorized,
      });
      expect(goToNextResponseHandler).toEqual(false);
    });

    test("Should authorise and go to the next response handler when given correct username and password", () => {
      const req = {
        authorization: {
          basic: {
            username: "test",
            password: "12345",
          },
        },
        connection: {
          remoteAddress: "localhost",
        },
      };
      let sentMessage: any;
      const res = {
        send: (message) => {
          sentMessage = message;
        },
      };
      const next = jest.fn();

      auth.authorisation(req as any, res as any, next as any);

      expect(sentMessage).toBeUndefined();
      expect(next.mock.calls.length).toBe(1);
    });
  });
});
