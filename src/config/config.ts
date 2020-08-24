import { config } from "dotenv";
import { PoolConfig } from "mariadb";
import { resolve } from "path";
import * as process from "process";
import { IEnvironmentOptions } from "./interfaces/environmentOptions.interface";
import { ILoggerEnvironmentOptions } from "./interfaces/loggerEnvironmentOptions.interface";

/* Holds the software's config taken from the constructor object, then if
  undefined, process.env, then a default value */
export class Config {
  // the current environment node.js is running in, e.g. "test", "development",
  // "production".
  public env: string;
  // the port number for restify to listen on.
  public port: number;
  // the hostname for the QRCode path URL.
  public localHost: string;
  // the hostname for restify to listen on.
  public restifyHost: string;
  // the authentication password to access this service.
  public authPassword: string | undefined;
  // the authentication username to access this service.
  public authUsername: string | undefined;
  // optional cert path, for using https
  public certURI: string | undefined;
  // optional key path, for using https
  public keyURI: string | undefined;
  // allowed origins, i.e. the hostname of the tables-ui project
  public origins: string[];
  // mariaDB Pool config. Refer to README.md for more info.
  public mariaDB: PoolConfig;
  // the database name to use on mariaDB
  public database: string;
  // the logger config, Refer to loggerEnvironmentOptions file or README.md for
  // more info.
  public logger: ILoggerEnvironmentOptions;

  // The constructor deconstructs the EnvironmentOptions object.
  constructor({
    // the current environment node.js is running in, e.g. "test", "development",
    // "production".
    env: env,
    // the port number for restify to listen on.
    port: port,
    // the hostname for the QRCode path URL.
    localHost: localHost,
    // the hostname for restify to listen on.
    restifyHost: restifyHost,
    // the authentication password to access this service.
    authPassword: authPassword,
    // the authentication username to access this service.
    authUsername: authUsername,
    // optional cert path, for using https
    certURI: certURI,
    // optional key path, for using https
    keyURI: keyURI,
    // allowed origins, i.e. the hostname of the tables-ui project
    origins: origins,
    // mariaDB Pool config. Refer to README.md for more info.
    mariaDB: mariaDB,
    // the database name to use on mariaDB
    database: database,
    // the logger config, Refer to loggerEnvironmentOptions file or README.md for
    // more info.
    logger: logger,
  }: IEnvironmentOptions = {}) {
    // load the .env file if the environment is "development".
    if (
      typeof process.env.NODE_ENV === "undefined" ||
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      config();
    }

    // load the .env.test file if the environment is "test".
    if (process.env.NODE_ENV === "testenv") {
      config({ path: resolve(process.cwd(), ".env.test") });
    }

    // set each property using the deconstructed variable, failing that, then
    // the from the environment variables, failing that, the default value.
    this.env = env || process.env.NODE_ENV || "development";

    if (typeof port === "number") {
      this.port = port;
    } else if (typeof process.env.PORT === "string") {
      this.port = +process.env.PORT;
    } else {
      this.port = 8080;
    }

    this.localHost = localHost || process.env.LOCAL_HOST || "localhost";
    this.restifyHost = restifyHost || process.env.RESTIFY_HOST || "localhost";
    this.authPassword = authPassword || process.env.AUTH_PASSWORD || undefined;
    this.authUsername = authUsername || process.env.AUTH_USERNAME || undefined;
    this.certURI = certURI || process.env.CERT_URI || undefined;
    this.keyURI = keyURI || process.env.KEY_URI || undefined;
    this.origins = origins?.split(",") ||
      process.env.ORIGINS?.split(",") || ["http://localhost:3000"];
    this.mariaDB = {
      host: mariaDB?.host || process.env.MARIA_DB_HOST || "localhost",
      user: mariaDB?.user || process.env.MARIA_DB_USER || "",
      password: mariaDB?.password || process.env.MARIA_DB_PASSWORD || "",
    };

    if (typeof mariaDB?.connectionLimit === "number") {
      this.mariaDB.connectionLimit = mariaDB.connectionLimit;
    } else if (typeof process.env.MARIA_DB_CONNECTION_LIMIT === "string") {
      this.mariaDB.connectionLimit = +process.env.MARIA_DB_CONNECTION_LIMIT;
    } else {
      this.mariaDB.connectionLimit = 10;
    }

    this.database = database || process.env.DATABASE || "hungryhungry";
    this.logger = {
      logTransports: logger?.logTransports ||
        process.env.LOG_TRANSPORTS?.split(",") || ["console", "database"],
      fileLogLevel:
        logger?.fileLogLevel || process.env.FILE_LOG_LEVEL || undefined,
      fileLogPath:
        logger?.fileLogPath || process.env.FILE_LOG_PATH || undefined,
      consoleLogLevel:
        logger?.consoleLogLevel || process.env.CONSOLE_LOG_LEVEL || undefined,
      databaseLogLevel:
        logger?.databaseLogLevel || process.env.DATABASE_LOG_LEVEL || undefined,
    };
  }
}
