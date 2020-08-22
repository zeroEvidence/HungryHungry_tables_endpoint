import { appendFile } from "fs";
import { Pool } from "mariadb";
import { isAbsolute, join } from "path";
import { ILoggerEnvironmentOptions } from "../config/interfaces/loggerEnvironmentOptions.interface";
import { ILogLevels } from "./interfaces/logLevels.interface";
import { IMariaDBTransportOptions } from "./interfaces/mariaDBTransportOptions.interface";

export class Logger {
  private levels: ILogLevels;
  private databaseLogLevel: number | undefined;
  private consoleLogLevel: number | undefined;
  private fileLogLevel: number | undefined;
  private fileLogPath: string | undefined;
  private tableName: string;
  private connection: any;
  private pool: Pool;
  private databaseName: string;

  constructor(
    private options: ILoggerEnvironmentOptions & IMariaDBTransportOptions
  ) {
    this.levels = {
      error: 5,
      warn: 4,
      info: 3,
      verbose: 2,
      debug: 1,
      silly: 0,
    };

    this.tableName = this.options.tableName || "logs";

    this.connection = this.options.connection || {};

    this.connection.charset =
      this.options.connection && this.options.connection.charset
        ? this.options.connection.charset
        : "utf8";
    this.connection.collate =
      this.options.connection && this.options.connection.collate
        ? this.options.connection.collate
        : "utf8_general_ci";

    if (typeof this.options.databasePool === "undefined") {
      throw new Error("options.databasePool is undefined.");
    }

    if (typeof this.options.databaseName === "undefined") {
      throw new Error("options.databaseName is undefined.");
    }

    this.pool = this.options.databasePool;
    this.databaseName = this.options.databaseName;

    this.initTable().catch((err: any) =>
      // tslint:disable-next-line
      console.error("Error creating log table on database:", err)
    );

    if (
      this.options.logTransports?.some(
        (logTransport) => logTransport === "database"
      ) &&
      typeof this.options.databaseLogLevel === "string" &&
      this.levels.hasOwnProperty(this.options.databaseLogLevel)
    ) {
      this.databaseLogLevel = this.levels[this.options.databaseLogLevel];
    }

    if (
      this.options.logTransports?.some(
        (logTransport) => logTransport === "console"
      ) &&
      typeof this.options.consoleLogLevel === "string" &&
      this.levels.hasOwnProperty(this.options.consoleLogLevel)
    ) {
      this.consoleLogLevel = this.levels[this.options.consoleLogLevel];
    }

    if (
      this.options.logTransports?.some(
        (logTransport) => logTransport === "file"
      ) &&
      typeof this.options.fileLogLevel === "string" &&
      this.levels.hasOwnProperty(this.options.fileLogLevel) &&
      typeof this.options.fileLogPath === "string"
    ) {
      this.fileLogLevel = this.levels[this.options.fileLogLevel];

      if (isAbsolute(this.options.fileLogPath)) {
        this.fileLogPath = this.options.fileLogPath;
      } else {
        this.fileLogPath = join(
          typeof process.env.PWD === "string" ? process.env.PWD : "",
          this.options.fileLogPath
        );
      }
    }
  }

  public error(message: string) {
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.error >= this.databaseLogLevel
    ) {
      this.logToDatabase(message, "error");
    }

    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.error >= this.fileLogLevel
    ) {
      this.logToFile(message, "error");
    }

    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.error >= this.consoleLogLevel
    ) {
      this.logToConsole(message, "error");
    }
  }

  public warn(message: string) {
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.warn >= this.databaseLogLevel
    ) {
      this.logToDatabase(message, "warn");
    }

    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.warn >= this.fileLogLevel
    ) {
      this.logToFile(message, "warn");
    }

    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.warn >= this.consoleLogLevel
    ) {
      this.logToConsole(message, "warn");
    }
  }

  public info(message: string) {
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.info >= this.databaseLogLevel
    ) {
      this.logToDatabase(message, "info");
    }

    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.info >= this.fileLogLevel
    ) {
      this.logToFile(message, "info");
    }

    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.info >= this.consoleLogLevel
    ) {
      this.logToConsole(message, "info");
    }
  }

  public verbose(message: string) {
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.verbose >= this.databaseLogLevel
    ) {
      this.logToDatabase(message, "verbose");
    }

    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.verbose >= this.fileLogLevel
    ) {
      this.logToFile(message, "verbose");
    }

    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.verbose >= this.consoleLogLevel
    ) {
      this.logToConsole(message, "verbose");
    }
  }

  public debug(message: string) {
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.debug >= this.databaseLogLevel
    ) {
      this.logToDatabase(message, "debug");
    }

    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.debug >= this.fileLogLevel
    ) {
      this.logToFile(message, "debug");
    }

    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.debug >= this.consoleLogLevel
    ) {
      this.logToConsole(message, "debug");
    }
  }

  public silly(message: string) {
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.silly >= this.databaseLogLevel
    ) {
      this.logToDatabase(message, "silly");
    }

    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.silly >= this.fileLogLevel
    ) {
      this.logToFile(message, "silly");
    }

    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.silly >= this.consoleLogLevel
    ) {
      this.logToConsole(message, "silly");
    }
  }

  private async logToDatabase(
    message: string,
    level: string,
    timestamp = new Date()
  ) {
    const sql =
      `INSERT INTO ${this.databaseName}.${this.tableName} ` +
      "(level, message, timestamp) " +
      "VALUES (:level, :message, :timestamp)";

    this.pool
      .query(sql, {
        timestamp,
        level,
        message,
      })
      .catch((error) => {
        // tslint:disable-next-line
        console.error(error);
      });
  }

  private logToFile(message: string, level: string, timestamp = new Date()) {
    if (!!this.fileLogPath) {
      const fileData = `level: ${level}, timestamp: ${timestamp}, message: ${message}`;

      appendFile(this.fileLogPath, fileData, "utf8", (error) => {
        // tslint:disable-next-line
        console.error(error);
      });
    }
  }

  private logToConsole(message: string, level: string, timestamp = new Date()) {
    const stdOut = `timestamp: ${timestamp}, message: ${message}`;

    switch (level) {
      case "error":
        // tslint:disable-next-line
        console.error(stdOut);
        break;

      case "warn":
        // tslint:disable-next-line
        console.warn(stdOut);
        break;

      case "info":
        // tslint:disable-next-line
        console.info(stdOut);
        break;

      case "verbose":
        // tslint:disable-next-line
        console.log(stdOut);
        break;

      case "debug":
        // tslint:disable-next-line
        console.debug(stdOut);
        break;

      case "silly":
        // tslint:disable-next-line
        console.log(stdOut);
        break;

      default:
        // tslint:disable-next-line
        console.log(stdOut);
        break;
    }
  }

  private async initTable() {
    const { charset, collate } = this.connection;
    const sql =
      `CREATE TABLE IF NOT EXISTS ${this.databaseName}.${this.tableName} (` +
      "id int(11) unsigned NOT NULL AUTO_INCREMENT, " +
      `level varchar(15) COLLATE ${collate} NOT NULL DEFAULT '',` +
      `message text COLLATE ${collate},` +
      "timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
      "PRIMARY KEY (id)" +
      `) ENGINE=InnoDB DEFAULT CHARSET=${charset} COLLATE=${collate};`;

    this.pool.query(sql).catch((error) => {
      // tslint:disable-next-line
      console.error(error);
    });
  }
}
