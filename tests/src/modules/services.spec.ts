import { resolve } from "path";
import { Config } from "../../../src/config/config";
import { Instance } from "../../../src/config/instance";
import { Strings } from "../../../src/config/strings";
import { JohnnysBurgerBarRestaurantController } from "../../../src/controllers/johnnysBurgerBarRestaurantController";
import { Database } from "../../../src/database/database";
import { Auth } from "../../../src/middleware/auth";
import { Cors } from "../../../src/middleware/cors";
import { RequestLogger } from "../../../src/middleware/requestLogger";
import { Services } from "../../../src/modules/services";
import { TableRepository } from "../../../src/repository/tableRepository";
import { JohnnysBurgerBarRestaurant } from "../../../src/restaurants/johnnysBurgerBarRestaurant";
import { Routes } from "../../../src/routes/routes";
import { RoutesConfig } from "../../../src/routes/routesConfig";
import { Server } from "../../../src/services/server";
import { Logger } from "../../../src/utils/logger";
import { MockDatabase } from "../../__mocks/mockDatabase";
import { MockLogger } from "../../__mocks/mockLogger";
import { MockTableRepository } from "../../__mocks/mockTableRepository";

describe("Services", () => {
  let database: Database;
  let logger: Logger;
  let config: Config;
  let tableRepository: TableRepository;

  beforeAll(() => {
    database = new MockDatabase() as any;
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
    }) as any;
    tableRepository = new MockTableRepository() as any;
  });

  describe("boot", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "test";
    });

    test("database should start", async () => {
      const cb = jest.fn();
      database.start = cb;

      const services = new Services(config, tableRepository, logger, database);
      await services.boot();

      expect(cb.mock.calls.length).toBe(1);
    });

    test("getJBBR should be called id NODE_ENV = production", async () => {
      process.env.NODE_ENV = "production";
      const cb = jest.fn();
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = cb;

      await services.boot();

      expect(cb.mock.calls.length).toBe(1);
    });
  });

  describe("getConfig", () => {
    test("Should get Config if getConfig has not called/set before", () => {
      const services = new Services(
        undefined,
        tableRepository,
        logger,
        database
      );

      services.getJBBR = () => undefined;
      services.boot();

      const config = services.getConfig();

      expect(config instanceof Config).toEqual(true);
    });

    test("Should get Config if getConfig has been called/set before", () => {
      const services = new Services(
        undefined,
        tableRepository,
        logger,
        database
      );

      services.getJBBR = () => undefined;
      services.boot();
      services.getConfig();

      const config = services.getConfig();

      expect(config instanceof Config).toEqual(true);
    });
  });

  describe("getStrings", () => {
    test("Should get Strings if getStrings has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const strings = services.getStrings();

      expect(strings instanceof Strings).toEqual(true);
    });

    test("Should get Strings if getStrings has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getStrings();

      const strings = services.getStrings();

      expect(strings instanceof Strings).toEqual(true);
    });
  });

  describe("getInstance", () => {
    test("Should get Instance if getInstance has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const instance = services.getInstance();

      expect(instance instanceof Instance).toEqual(true);
    });

    test("Should get Instance if getInstance has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getInstance();

      const instance = services.getInstance();

      expect(instance instanceof Instance).toEqual(true);
    });
  });

  describe("getLogger", () => {
    test("Should get Logger if getLogger has not called/set before", () => {
      const services = new Services(
        config,
        tableRepository,
        undefined,
        database
      );

      services.getJBBR = () => undefined;
      services.boot();

      const logger = services.getLogger();

      expect(logger instanceof Logger).toEqual(true);
    });

    test("Should get Logger if getLogger has been called/set before", () => {
      const services = new Services(
        config,
        tableRepository,
        undefined,
        database
      );

      services.getJBBR = () => undefined;
      services.boot();
      services.getLogger();

      const logger = services.getLogger();

      expect(logger instanceof Logger).toEqual(true);
    });
  });

  describe("getTableRepository", () => {
    test("Should get TableRepository if getTableRepository has not called/set before", async () => {
      const services = new Services(config, undefined, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const tableRepo = await services.getTableRepository();

      expect(tableRepo instanceof TableRepository).toEqual(true);
    });

    test("Should get TableRepository if getTableRepository has been called/set before", async () => {
      const services = new Services(config, undefined, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      await services.getTableRepository();

      const tableRepo = await services.getTableRepository();

      expect(tableRepo instanceof TableRepository).toEqual(true);
    });
  });

  describe("getReqLogger", () => {
    test("Should get RequestLogger if getReqLogger has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const reqLogger = services.getReqLogger();

      expect(reqLogger instanceof RequestLogger).toEqual(true);
    });

    test("Should get RequestLogger if getReqLogger has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getReqLogger();

      const reqLogger = services.getReqLogger();

      expect(reqLogger instanceof RequestLogger).toEqual(true);
    });
  });
  describe("getAuth", () => {
    test("Should get Auth if getAuth has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const auth = services.getAuth();

      expect(auth instanceof Auth).toEqual(true);
    });

    test("Should get Auth if getAuth has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getAuth();

      const auth = services.getAuth();

      expect(auth instanceof Auth).toEqual(true);
    });
  });

  describe("getCors", () => {
    test("Should get Cors if getCors has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const cors = services.getCors();

      expect(cors instanceof Cors).toEqual(true);
    });

    test("Should get Cors if getCors has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getCors();

      const cors = services.getCors();

      expect(cors instanceof Cors).toEqual(true);
    });
  });

  describe("getRestifyServer", () => {
    test("Should get restify.Server if getRestifyServer has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const restifyServer = services.getRestifyServer();

      expect(typeof restifyServer === "object").toEqual(true);
      expect(typeof restifyServer.address === "function").toEqual(true);
      expect(typeof restifyServer.listen === "function").toEqual(true);
      expect(typeof restifyServer.close === "function").toEqual(true);
      expect(typeof restifyServer.inflightRequests === "function").toEqual(
        true
      );
      expect(typeof restifyServer.del === "function").toEqual(true);
      expect(typeof restifyServer.get === "function").toEqual(true);
      expect(typeof restifyServer.head === "function").toEqual(true);
      expect(typeof restifyServer.opts === "function").toEqual(true);
      expect(typeof restifyServer.post === "function").toEqual(true);
      expect(typeof restifyServer.put === "function").toEqual(true);
      expect(typeof restifyServer.patch === "function").toEqual(true);
      expect(typeof restifyServer.param === "function").toEqual(true);
      expect(typeof restifyServer.rm === "function").toEqual(true);
      expect(typeof restifyServer.use === "function").toEqual(true);
      expect(typeof restifyServer.pre === "function").toEqual(true);
      expect(typeof restifyServer.toString === "function").toEqual(true);
      expect(typeof restifyServer.getDebugInfo === "function").toEqual(true);
      expect(restifyServer.hasOwnProperty("name")).toEqual(true);
      expect(restifyServer.hasOwnProperty("log")).toEqual(true);
      expect(restifyServer.hasOwnProperty("acceptable")).toEqual(true);
      expect(restifyServer.hasOwnProperty("url")).toEqual(true);
      expect(restifyServer.hasOwnProperty("server")).toEqual(true);
      expect(restifyServer.hasOwnProperty("router")).toEqual(true);
      expect(restifyServer.hasOwnProperty("handleUncaughtExceptions")).toEqual(
        true
      );
      expect(restifyServer.hasOwnProperty("dtrace")).toEqual(true);
      expect(restifyServer.hasOwnProperty("formatters")).toEqual(true);
      expect(restifyServer.hasOwnProperty("onceNext")).toEqual(true);
      expect(restifyServer.hasOwnProperty("strictNext")).toEqual(true);
      expect(restifyServer.hasOwnProperty("preChain")).toEqual(true);
      expect(restifyServer.hasOwnProperty("useChain")).toEqual(true);
      expect(restifyServer.secure).toEqual(false);
    });

    test("Should get restify.Server if getRestifyServer has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getRestifyServer();

      const restifyServer = services.getRestifyServer();

      expect(typeof restifyServer === "object").toEqual(true);
      expect(typeof restifyServer.address === "function").toEqual(true);
      expect(typeof restifyServer.listen === "function").toEqual(true);
      expect(typeof restifyServer.close === "function").toEqual(true);
      expect(typeof restifyServer.inflightRequests === "function").toEqual(
        true
      );
      expect(typeof restifyServer.del === "function").toEqual(true);
      expect(typeof restifyServer.get === "function").toEqual(true);
      expect(typeof restifyServer.head === "function").toEqual(true);
      expect(typeof restifyServer.opts === "function").toEqual(true);
      expect(typeof restifyServer.post === "function").toEqual(true);
      expect(typeof restifyServer.put === "function").toEqual(true);
      expect(typeof restifyServer.patch === "function").toEqual(true);
      expect(typeof restifyServer.param === "function").toEqual(true);
      expect(typeof restifyServer.rm === "function").toEqual(true);
      expect(typeof restifyServer.use === "function").toEqual(true);
      expect(typeof restifyServer.pre === "function").toEqual(true);
      expect(typeof restifyServer.toString === "function").toEqual(true);
      expect(typeof restifyServer.getDebugInfo === "function").toEqual(true);
      expect(restifyServer.hasOwnProperty("name")).toEqual(true);
      expect(restifyServer.hasOwnProperty("log")).toEqual(true);
      expect(restifyServer.hasOwnProperty("acceptable")).toEqual(true);
      expect(restifyServer.hasOwnProperty("url")).toEqual(true);
      expect(restifyServer.hasOwnProperty("server")).toEqual(true);
      expect(restifyServer.hasOwnProperty("router")).toEqual(true);
      expect(restifyServer.hasOwnProperty("handleUncaughtExceptions")).toEqual(
        true
      );
      expect(restifyServer.hasOwnProperty("dtrace")).toEqual(true);
      expect(restifyServer.hasOwnProperty("formatters")).toEqual(true);
      expect(restifyServer.hasOwnProperty("onceNext")).toEqual(true);
      expect(restifyServer.hasOwnProperty("strictNext")).toEqual(true);
      expect(restifyServer.hasOwnProperty("preChain")).toEqual(true);
      expect(restifyServer.hasOwnProperty("useChain")).toEqual(true);
      expect(restifyServer.secure).toEqual(false);
    });

    test("Should get restify.Server if getRestifyServer has not been called/set before and SSL key and cert URI have been given.", () => {
      config.certURI = resolve(process.cwd(), "./tests/ssl/server.crt");
      config.keyURI = resolve(process.cwd(), "./tests/ssl/server.key");

      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getRestifyServer();

      const restifyServer = services.getRestifyServer();

      expect(typeof restifyServer === "object").toEqual(true);
      expect(typeof restifyServer.address === "function").toEqual(true);
      expect(typeof restifyServer.listen === "function").toEqual(true);
      expect(typeof restifyServer.close === "function").toEqual(true);
      expect(typeof restifyServer.inflightRequests === "function").toEqual(
        true
      );
      expect(typeof restifyServer.del === "function").toEqual(true);
      expect(typeof restifyServer.get === "function").toEqual(true);
      expect(typeof restifyServer.head === "function").toEqual(true);
      expect(typeof restifyServer.opts === "function").toEqual(true);
      expect(typeof restifyServer.post === "function").toEqual(true);
      expect(typeof restifyServer.put === "function").toEqual(true);
      expect(typeof restifyServer.patch === "function").toEqual(true);
      expect(typeof restifyServer.param === "function").toEqual(true);
      expect(typeof restifyServer.rm === "function").toEqual(true);
      expect(typeof restifyServer.use === "function").toEqual(true);
      expect(typeof restifyServer.pre === "function").toEqual(true);
      expect(typeof restifyServer.toString === "function").toEqual(true);
      expect(typeof restifyServer.getDebugInfo === "function").toEqual(true);
      expect(restifyServer.hasOwnProperty("name")).toEqual(true);
      expect(restifyServer.hasOwnProperty("log")).toEqual(true);
      expect(restifyServer.hasOwnProperty("acceptable")).toEqual(true);
      expect(restifyServer.hasOwnProperty("url")).toEqual(true);
      expect(restifyServer.hasOwnProperty("server")).toEqual(true);
      expect(restifyServer.hasOwnProperty("router")).toEqual(true);
      expect(restifyServer.hasOwnProperty("handleUncaughtExceptions")).toEqual(
        true
      );
      expect(restifyServer.hasOwnProperty("dtrace")).toEqual(true);
      expect(restifyServer.hasOwnProperty("formatters")).toEqual(true);
      expect(restifyServer.hasOwnProperty("onceNext")).toEqual(true);
      expect(restifyServer.hasOwnProperty("strictNext")).toEqual(true);
      expect(restifyServer.hasOwnProperty("preChain")).toEqual(true);
      expect(restifyServer.hasOwnProperty("useChain")).toEqual(true);
      expect(restifyServer.secure).toEqual(true);
    });
  });

  describe("getRoutesConfig", () => {
    test("Should get RoutesConfig if getRoutesConfig has not called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const routesConfig = services.getRoutesConfig();

      expect(routesConfig instanceof RoutesConfig).toEqual(true);
    });

    test("Should get RoutesConfig if getRoutesConfig has been called/set before", () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();
      services.getRoutesConfig();

      const routesConfig = services.getRoutesConfig();

      expect(routesConfig instanceof RoutesConfig).toEqual(true);
    });
  });

  describe("getJBBR", () => {
    test("Should get JohnnysBurgerBarRestaurant if getJBBR has not called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);
      const jbbr = await services.getJBBR();

      expect(jbbr instanceof JohnnysBurgerBarRestaurant).toEqual(true);
    });

    test("Should get JohnnysBurgerBarRestaurant if getJBBR has been called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      await services.getJBBR();

      const jbbr = await services.getJBBR();

      expect(jbbr instanceof JohnnysBurgerBarRestaurant).toEqual(true);
    });
  });

  describe("getJBBRController", () => {
    test("Should get JohnnysBurgerBarRestaurantController if getJBBRController has not called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const jbbrController = await services.getJBBRController();

      expect(
        jbbrController instanceof JohnnysBurgerBarRestaurantController
      ).toEqual(true);
    });

    test("Should get JohnnysBurgerBarRestaurantController if getJBBRController has been called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      await services.getJBBRController();

      const jbbrController = await services.getJBBRController();

      expect(
        jbbrController instanceof JohnnysBurgerBarRestaurantController
      ).toEqual(true);
    });
  });

  describe("getRoutes", () => {
    test("Should get Routes if getRoutes has not called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const routes = await services.getRoutes();

      expect(routes instanceof Routes).toEqual(true);
    });

    test("Should get Routes if getRoutes has been called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      await services.getRoutes();

      const routes = await services.getRoutes();

      expect(routes instanceof Routes).toEqual(true);
    });
  });

  describe("getServer", () => {
    test("Should get Server if getServer has not called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      const server = await services.getServer();

      expect(server instanceof Server).toEqual(true);
    });

    test("Should get Server if getServer has been called/set before", async () => {
      const services = new Services(config, tableRepository, logger, database);

      services.getJBBR = () => undefined;
      services.boot();

      await services.getServer();

      const server = await services.getServer();

      expect(server instanceof Server).toEqual(true);
    });
  });
});
