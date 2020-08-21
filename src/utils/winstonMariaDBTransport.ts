import { Pool } from "mariadb";
import { IMariaDBTransportOptions } from "./interfaces/mariaDBTransportOptions.interface";
import Transport = require("winston-transport");

export class WinstonMariaDBTransport extends Transport {
  public level: string;

  private name: string;
  private label: string;
  private tableName: string;
  private connection: any;
  private pool: Pool;
  private databaseName: string;

  /**
   * Constructor for the universal transport object.
   * @constructor
   * @param {Object} options
   * @param {string} [options.label] - Label stored with entry object if defined.
   * @param {string} [options.level=info] - Level of messages that this transport
   * should log.
   * @param {string} [options.name] - Transport instance identifier. Useful if you
   * need to create multiple universal transports.
   * @param {string} [options.tableName=winston_logs] - The name of the table you
   * want to store log messages in.
   * @param {Object} [options.connection] - Connection data to connect with database.
   * @param {string} [options.connection.charset=utf8] - Database connection charset.
   * @param {string} [options.connection.collate=utf8_general_ci] - Database connection collate.
   */
  constructor(options: IMariaDBTransportOptions) {
    super(options);
    this.name = "MySQLTransport";

    this.label = options.label || "";
    this.level = options.level || "info";
    this.tableName = options.tableName || "winston_logs";

    this.connection = options.connection || {};

    this.connection.charset =
      options.connection && options.connection.charset
        ? options.connection.charset
        : "utf8";
    this.connection.collate =
      options.connection && options.connection.collate
        ? options.connection.collate
        : "utf8_general_ci";

    if (typeof options.databasePool === "undefined") {
      throw new Error("options.databasePool is undefined.");
    }

    if (typeof options.databaseName === "undefined") {
      throw new Error("options.databaseName is undefined.");
    }

    this.pool = options.databasePool;
    this.databaseName = options.databaseName;

    this.initTable().catch((err: any) =>
      // tslint:disable-next-line
      console.error("Error creating log table on database:", err)
    );
  }

  /**
   * Core logging method exposed to Winston. Metadata is optional.
   * @param {string} level - Level at which to log the message.
   * @param {string} message - Message to log
   * @param {Object} meta - Metadata to log
   * @param {Function} callback - Continuation to respond to when complete.
   */
  public async log(...args: any) {
    const connection = await this.pool.getConnection();
    const lvl = args.shift() || this.level;
    const message = args.shift() || "";
    let meta = args.shift();
    let callback = args.shift();

    if (typeof meta === "function") {
      callback = meta;
      meta = {};
    }

    if (typeof meta === "undefined") {
      meta = {};
    }

    const sql =
      `INSERT INTO ${this.databaseName}.${this.tableName} ` +
      "(level, message, meta, timestamp) " +
      "VALUES (:lvl, :message, :meta, CURRENT_TIMESTAMP)";

    try {
      await connection.query(sql, {
        lvl,
        message,
        meta: JSON.stringify(meta),
      });

      await connection.commit();

      if (typeof callback === "function") {
        callback(null, true);
      }
    } catch (error) {
      await connection.rollback();

      if (typeof callback === "function") {
        callback(error);
      }

      // tslint:disable-next-line
      console.error(error);
    } finally {
      await connection.end();
    }
  }

  /**
   * Create logs table.
   * @return {Promise} result of creation within a Promise
   */
  private async initTable(): Promise<any> {
    const { charset, collate } = this.connection;
    const connection = await this.pool.getConnection();
    const sql =
      `CREATE TABLE IF NOT EXISTS ${this.databaseName}.${this.tableName} (` +
      "id int(11) unsigned NOT NULL AUTO_INCREMENT, " +
      `level varchar(15) COLLATE ${collate} NOT NULL DEFAULT '',` +
      `message text COLLATE ${collate},` +
      `meta text COLLATE ${collate},` +
      "timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
      "PRIMARY KEY (id)" +
      `) ENGINE=InnoDB DEFAULT CHARSET=${charset} COLLATE=${collate};`;

    try {
      await connection.query(sql);
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      await connection.end();
    }
  }
}
