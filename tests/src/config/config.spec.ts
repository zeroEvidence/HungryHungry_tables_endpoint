import { Config } from "../../../src/config/config";

describe("Config", () => {
  describe("Default value for properties", () => {
    let config: Config;

    beforeAll(() => {
      process.env.NODE_ENV = undefined;
      config = new Config();
    });

    test("env", () => {
      expect(config.env).toEqual("undefined");
    });

    test("port", () => {
      expect(config.port).toEqual(8080);
    });

    test("localHost", () => {
      expect(config.localHost).toEqual("localhost");
    });

    test("restifyHost", () => {
      expect(config.restifyHost).toEqual("localhost");
    });

    test("authPassword", () => {
      expect(config.authPassword).toBeUndefined();
    });

    test("authUsername", () => {
      expect(config.authUsername).toBeUndefined();
    });

    test("certURI", () => {
      expect(config.certURI).toBeUndefined();
    });

    test("keyURI", () => {
      expect(config.keyURI).toBeUndefined();
    });

    test("origins", () => {
      expect(config.origins).toEqual(["http://localhost:3000"]);
    });

    test("mariaDB", () => {
      expect(config.mariaDB).toEqual({
        host: "localhost",
        user: "",
        password: "",
        connectionLimit: 10,
      });
    });

    test("database", () => {
      expect(config.database).toEqual("hungryhungry");
    });

    test("logger", () => {
      expect(config.logger).toEqual({
        logTransports: ["console", "database"],
        fileLogLevel: undefined,
        fileLogPath: undefined,
        consoleLogLevel: undefined,
        databaseLogLevel: undefined,
      });
    });
  });

  describe("Overwritten values for properties by constructor object", () => {
    let config: Config;

    beforeAll(() => {
      config = new Config({
        env: "test",
        port: 9000,
        localHost: "otherhost",
        restifyHost: "0.0.0.0",
        authPassword: "abc123",
        authUsername: "test",
        certURI: "/some/location/cert.pem",
        keyURI: "/some/location/key.pem",
        origins: "http://somehost:8080,http://anotherhost",
        mariaDB: {
          host: "somehost",
          user: "test",
          password: "abc12345",
          connectionLimit: 5,
        },
        database: "someDatabase",
        logger: {
          logTransports: ["console"],
          fileLogLevel: "error",
          fileLogPath: "/some/path/log.log",
          consoleLogLevel: "error",
          databaseLogLevel: "error",
        },
      });
    });

    test("env", () => {
      expect(config.env).toEqual("test");
    });

    test("port", () => {
      expect(config.port).toEqual(9000);
    });

    test("localHost", () => {
      expect(config.localHost).toEqual("otherhost");
    });

    test("restifyHost", () => {
      expect(config.restifyHost).toEqual("0.0.0.0");
    });

    test("authPassword", () => {
      expect(config.authPassword).toEqual("abc123");
    });

    test("authUsername", () => {
      expect(config.authUsername).toEqual("test");
    });

    test("certURI", () => {
      expect(config.certURI).toEqual("/some/location/cert.pem");
    });

    test("keyURI", () => {
      expect(config.keyURI).toEqual("/some/location/key.pem");
    });

    test("origins", () => {
      expect(config.origins).toEqual([
        "http://somehost:8080",
        "http://anotherhost",
      ]);
    });

    test("mariaDB", () => {
      expect(config.mariaDB).toEqual({
        host: "somehost",
        user: "test",
        password: "abc12345",
        connectionLimit: 5,
      });
    });

    test("database", () => {
      expect(config.database).toEqual("someDatabase");
    });

    test("logger", () => {
      expect(config.logger).toEqual({
        logTransports: ["console"],
        fileLogLevel: "error",
        fileLogPath: "/some/path/log.log",
        consoleLogLevel: "error",
        databaseLogLevel: "error",
      });
    });
  });

  describe("Values for properties by environment variables", () => {
    let config: Config;

    beforeAll(() => {
      process.env.NODE_ENV = "testenv";
      config = new Config();
    });

    test("env", () => {
      expect(config.env).toEqual("testenv");
    });

    test("port", () => {
      expect(config.port).toEqual(10000);
    });

    test("localHost", () => {
      expect(config.localHost).toEqual("anyhost");
    });

    test("restifyHost", () => {
      expect(config.restifyHost).toEqual("thishost");
    });

    test("authPassword", () => {
      expect(config.authPassword).toEqual("12345");
    });

    test("authUsername", () => {
      expect(config.authUsername).toEqual("test1");
    });

    test("certURI", () => {
      expect(config.certURI).toEqual("/a/path/to/cert.pem");
    });

    test("keyURI", () => {
      expect(config.keyURI).toEqual("/a/path/to/key.pem");
    });

    test("origins", () => {
      expect(config.origins).toEqual([
        "http://anyhost:3000",
        "http://someotherhost",
      ]);
    });

    test("mariaDB", () => {
      expect(config.mariaDB).toEqual({
        host: "localhostTest",
        user: "testUser",
        password: "abc123",
        connectionLimit: 9,
      });
    });

    test("database", () => {
      expect(config.database).toEqual("hungryhungryTest");
    });

    test("logger", () => {
      expect(config.logger).toEqual({
        logTransports: ["console", "database", "file"],
        fileLogLevel: "info",
        fileLogPath: "/a/path/to/log.log",
        consoleLogLevel: "info",
        databaseLogLevel: "info",
      });
    });
  });
});
