import { appendFile } from "fs";
import { Pool } from "mariadb";
import { isAbsolute, join } from "path";
import { ILoggerEnvironmentOptions } from "../config/interfaces/loggerEnvironmentOptions.interface";
import { ILogLevels } from "./interfaces/logLevels.interface";
import { IMariaDBTransportOptions } from "./interfaces/mariaDBTransportOptions.interface";

// The Logger class which manages the output of logs.
export class Logger {
  protected levels: ILogLevels;
  protected databaseLogLevel: number | undefined;
  protected consoleLogLevel: number | undefined;
  protected fileLogLevel: number | undefined;
  protected fileLogPath: string | undefined;
  protected tableName: string;
  protected connection: any;
  protected pool: Pool;
  protected databaseName: string;

  // The constructor which takes an options object.
  constructor(
    protected options: ILoggerEnvironmentOptions & IMariaDBTransportOptions
  ) {
    // The possible log levels.
    this.levels = {
      error: 5,
      warn: 4,
      info: 3,
      verbose: 2,
      debug: 1,
      silly: 0,
    };

    // The table name within the database to write the logs to.
    this.tableName = this.options.tableName || "logs";

    // The database connection details.
    this.connection = this.options.connection || {};

    // Sets the connection charset to the incoming charset or defaults to "utf8"
    this.connection.charset =
      this.options.connection && this.options.connection.charset
        ? this.options.connection.charset
        : "utf8";
    // Sets the connection collate to the incoming collate or defaults to
    // "utf8_general_ci"
    this.connection.collate =
      this.options.connection && this.options.connection.collate
        ? this.options.connection.collate
        : "utf8_general_ci";

    // If the database pool is undefined, throw an error.
    if (typeof this.options.databasePool === "undefined") {
      throw new Error("options.databasePool is undefined.");
    }

    // If the database name is undefined, throw an error.
    if (typeof this.options.databaseName === "undefined") {
      throw new Error("options.databaseName is undefined.");
    }

    // Assign the database pool to the local "pool" property.
    this.pool = this.options.databasePool;
    // Assign the database name to the local "databaseName" property.
    this.databaseName = this.options.databaseName;

    // Initiate the log table on the database.
    this.initTable().catch((err: any) =>
      // Log any errors to the console.
      // tslint:disable-next-line
      console.error("Error creating log table on database:", err)
    );

    // If the logTransports options contains "database", and the
    // databaseLogLevel is a string, and it matches one of the levels above.
    if (
      this.options.logTransports?.some(
        (logTransport) => logTransport === "database"
      ) &&
      typeof this.options.databaseLogLevel === "string" &&
      this.levels.hasOwnProperty(this.options.databaseLogLevel)
    ) {
      // Set the property "databaseLogLevel" to the matching value in levels.
      this.databaseLogLevel = this.levels[this.options.databaseLogLevel];
    }

    // If the logTransports option contains "console", and the consoleLogLevel
    // is a string, and the it matches on of the levels above.
    if (
      this.options.logTransports?.some(
        (logTransport) => logTransport === "console"
      ) &&
      typeof this.options.consoleLogLevel === "string" &&
      this.levels.hasOwnProperty(this.options.consoleLogLevel)
    ) {
      // Set the property "consoleLogLevel" to the matching value in levels.
      this.consoleLogLevel = this.levels[this.options.consoleLogLevel];
    }

    // If the logTransports option contains "file", and the consoleLogLevel
    // is a string, and the it matches on of the levels above.
    if (
      this.options.logTransports?.some(
        (logTransport) => logTransport === "file"
      ) &&
      typeof this.options.fileLogLevel === "string" &&
      this.levels.hasOwnProperty(this.options.fileLogLevel) &&
      typeof this.options.fileLogPath === "string"
    ) {
      // Set the property "fileLogLevel" to the matching value in levels.
      this.fileLogLevel = this.levels[this.options.fileLogLevel];

      // If the fileLogPath is an absolute path.
      if (isAbsolute(this.options.fileLogPath)) {
        // Assign it to the fileLogPath property.
        this.fileLogPath = this.options.fileLogPath;
      } else {
        // If it is a relative path, join the process working directory to the
        // beginning of the supplied fileLogPath then assign it to the
        // fileLogPath property.
        this.fileLogPath = join(
          typeof process.env.PWD === "string" ? process.env.PWD : "",
          this.options.fileLogPath
        );
      }
    }
  }

  // Log an error to the relevant log transports.
  public error(message: string) {
    // If the databaseLogLevel is a number and the level of "error" is greater
    // or equal to the databaseLogLevel...
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.error >= this.databaseLogLevel
    ) {
      // Then log the incoming message to the database.
      this.logToDatabase(message, "error");
    }

    // If the fileLogLevel is a number and the level of "error" is greater
    // or equal to the fileLogLevel...
    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.error >= this.fileLogLevel
    ) {
      // Then log to file.
      this.logToFile(message, "error");
    }

    // If the consoleLogLevel is a number and the level of "error" is greater
    // or equal to the consoleLogLevel...
    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.error >= this.consoleLogLevel
    ) {
      // Then log to console.
      this.logToConsole(message, "error");
    }
  }

  // Log a warning to the relevant log transports.
  public warn(message: string) {
    // If the databaseLogLevel is a number and the level of "warn" is greater
    // or equal to the databaseLogLevel...
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.warn >= this.databaseLogLevel
    ) {
      // Then log the incoming message to the database.
      this.logToDatabase(message, "warn");
    }

    // If the fileLogLevel is a number and the level of "warn" is greater
    // or equal to the fileLogLevel...
    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.warn >= this.fileLogLevel
    ) {
      // Then log to file.
      this.logToFile(message, "warn");
    }

    // If the consoleLogLevel is a number and the level of "warn" is greater
    // or equal to the consoleLogLevel...
    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.warn >= this.consoleLogLevel
    ) {
      // Then log to console.
      this.logToConsole(message, "warn");
    }
  }

  // Log info to the relevant log transports.
  public info(message: string) {
    // If the databaseLogLevel is a number and the level of "info" is greater
    // or equal to the databaseLogLevel...
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.info >= this.databaseLogLevel
    ) {
      // Then log the incoming message to the database.
      this.logToDatabase(message, "info");
    }

    // If the fileLogLevel is a number and the level of "info" is greater
    // or equal to the fileLogLevel...
    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.info >= this.fileLogLevel
    ) {
      // Then log to file.
      this.logToFile(message, "info");
    }

    // If the consoleLogLevel is a number and the level of "info" is greater
    // or equal to the consoleLogLevel...
    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.info >= this.consoleLogLevel
    ) {
      // Then log to console.
      this.logToConsole(message, "info");
    }
  }

  // Log a "verbose" message to the relevant log transports.
  public verbose(message: string) {
    // If the databaseLogLevel is a number and the level of "verbose" is greater
    // or equal to the databaseLogLevel...
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.verbose >= this.databaseLogLevel
    ) {
      // Then log the incoming message to the database.
      this.logToDatabase(message, "verbose");
    }

    // If the fileLogLevel is a number and the level of "verbose" is greater
    // or equal to the fileLogLevel...
    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.verbose >= this.fileLogLevel
    ) {
      // Then log to file.
      this.logToFile(message, "verbose");
    }

    // If the consoleLogLevel is a number and the level of "info" is greater
    // or equal to the consoleLogLevel...
    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.verbose >= this.consoleLogLevel
    ) {
      // Then log to console.
      this.logToConsole(message, "verbose");
    }
  }

  // Log a debug message to the relevant log transports.
  public debug(message: string) {
    // If the databaseLogLevel is a number and the level of "debug" is greater
    // or equal to the databaseLogLevel...
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.debug >= this.databaseLogLevel
    ) {
      // Then log the incoming message to the database.
      this.logToDatabase(message, "debug");
    }

    // If the fileLogLevel is a number and the level of "debug" is greater
    // or equal to the fileLogLevel...
    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.debug >= this.fileLogLevel
    ) {
      // Then log to file.
      this.logToFile(message, "debug");
    }

    // If the consoleLogLevel is a number and the level of "debug" is greater
    // or equal to the consoleLogLevel...
    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.debug >= this.consoleLogLevel
    ) {
      // Then log to console.
      this.logToConsole(message, "debug");
    }
  }

  // Log a "silly" message to the relevant log transports.
  public silly(message: string) {
    // If the databaseLogLevel is a number and the level of "silly" is greater
    // or equal to the databaseLogLevel...
    if (
      typeof this.databaseLogLevel === "number" &&
      this.levels.silly >= this.databaseLogLevel
    ) {
      // Then log the incoming message to the database.
      this.logToDatabase(message, "silly");
    }

    // If the fileLogLevel is a number and the level of "silly" is greater
    // or equal to the fileLogLevel...
    if (
      typeof this.fileLogLevel === "number" &&
      this.levels.silly >= this.fileLogLevel
    ) {
      // Then log to file.
      this.logToFile(message, "silly");
    }

    // If the consoleLogLevel is a number and the level of "silly" is greater
    // or equal to the consoleLogLevel...
    if (
      typeof this.consoleLogLevel === "number" &&
      this.levels.silly >= this.consoleLogLevel
    ) {
      // Then log to console.
      this.logToConsole(message, "silly");
    }
  }

  // Logs a message to the database.
  protected async logToDatabase(
    message: string,
    level: string,
    timestamp = new Date()
  ) {
    const sql =
      `INSERT INTO ${this.databaseName}.${this.tableName} ` +
      "(level, message, timestamp) " +
      "VALUES (:level, :message, :timestamp)";

    // Runs the SQL above, inserting the timestamp, level, and message
    // variables.
    this.pool
      .query(sql, {
        timestamp,
        level,
        message,
      })
      .catch((error) => {
        // If there is an error log it to the console.
        // tslint:disable-next-line
        console.error(error);
      });
  }

  // Logs a message to a file.
  protected logToFile(message: string, level: string, timestamp = new Date()) {
    // If the log file path has been set.
    if (!!this.fileLogPath) {
      const fileData = `level: ${level}, timestamp: ${timestamp}, message: ${message}`;

      // Append to the file with the level, timestamp, and message.
      appendFile(this.fileLogPath, fileData, "utf8", (error) => {
        // If there is an error log it to the console.
        // tslint:disable-next-line
        console.error(error);
      });
    }
  }

  // Logs a message to the console.
  private logToConsole(message: string, level: string, timestamp = new Date()) {
    // Create the message with a timestamp.
    const stdOut = `timestamp: ${timestamp}, message: ${message}`;

    // If the incoming level is...
    switch (level) {
      // An "error".
      case "error":
        // Log to the error console.
        // tslint:disable-next-line
        console.error(stdOut);
        break;

      // A "warn".
      case "warn":
        // Log to the warn console.
        // tslint:disable-next-line
        console.warn(stdOut);
        break;

      // An "info".
      case "info":
        // Log to the info console.
        // tslint:disable-next-line
        console.info(stdOut);
        break;

      // A "verbose".
      case "verbose":
        // Log to the log console. (Verbose console doesn't exist).
        // tslint:disable-next-line
        console.log(stdOut);
        break;

      // A "debug".
      case "debug":
        // Log to the debug console.
        // tslint:disable-next-line
        console.debug(stdOut);
        break;

      // A "silly".
      case "silly":
        // Log to the log console. (Silly console doesn't exist).
        // tslint:disable-next-line
        console.log(stdOut);
        break;

      // If nothing matches.
      default:
        // Log to the log console.
        // tslint:disable-next-line
        console.log(stdOut);
        break;
    }
  }

  // Initialise the logs table on the database.
  protected async initTable() {
    // Deconstruct the charset and collate.
    const { charset, collate } = this.connection;
    const sql =
      `CREATE TABLE IF NOT EXISTS ${this.databaseName}.${this.tableName} (` +
      "id int(11) unsigned NOT NULL AUTO_INCREMENT, " +
      `level varchar(15) COLLATE ${collate} NOT NULL DEFAULT '',` +
      `message text COLLATE ${collate},` +
      "timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
      "PRIMARY KEY (id)" +
      `) ENGINE=InnoDB DEFAULT CHARSET=${charset} COLLATE=${collate};`;

    // Execute the SQL against the database.
    await this.pool.query(sql).catch((error) => {
      // If there are any errors log the to the console.
      // tslint:disable-next-line
      console.error(error);
    });
  }
}
