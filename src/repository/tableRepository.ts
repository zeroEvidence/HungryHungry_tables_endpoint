import { Pool } from "mariadb";
import { Config } from "../config/config";
import { Database } from "../database/database";
import { IQRCode } from "../interfaces/qrCode.interface";
import { IQRTable } from "../interfaces/qrTable.interface";
import { ITable } from "../interfaces/table.interface";
import { Logger } from "../utils/logger";

// The TableRepository class allows for the interaction with the tables table
// on the database.
export class TableRepository {
  private pool: Pool;
  private schema: string;

  constructor(
    private database: Database,
    private config: Config,
    private logger: Logger
  ) {
    // Get the database pool.
    this.pool = this.database.pool;
    // Get the name of the database.
    this.schema = this.config.database;
  }

  // Setup the database and create the table.
  public async setup() {
    try {
      // Create the database.
      await this.createSchema();
      // Create the tables table.
      await this.createTable();
    } catch (error) {
      // Log any errors that occur.
      this.logger.error(error);
    }
  }

  // Creates the database.
  public async createSchema() {
    const sql = `CREATE SCHEMA IF NOT EXISTS ${this.schema};`;

    // Run the SQL against the database.
    await this.pool.query(sql).catch((error) => {
      // Log any errors that occur.
      this.logger.error(error);
    });
  }

  // Creates the tables table.
  public async createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS ${this.schema}.tables (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        room VARCHAR(45) NOT NULL,
        tableID VARCHAR(45) NOT NULL,
        tableName VARCHAR(45) NOT NULL,
        visible TINYINT NOT NULL,
        QRCodePath VARCHAR(255) NOT NULL,
        QRCodeData TEXT(65535) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY (tableID)
      );`;

    // Run the SQL against the database.
    await this.pool.query(sql).catch((error) => {
      // Log any errors that occur.
      this.logger.error(error);
    });
  }

  // Insert or update table records.
  public async insertTables(tables: IQRTable[]) {
    const sql =
      `INSERT INTO ${this.schema}.tables(room, tableID, tableName, visible, ` +
      "QRCodePath, QRCodeData) " +
      "VALUES (:room, :tableID, :tableName, :visible, :QRCodePath, " +
      ":QRCodeData) " +
      "ON DUPLICATE KEY UPDATE room=VALUES(room), " +
      "tableName=VALUES(tableName), visible=VALUES(visible), " +
      "QRCodePath=VALUES(QRCodePath)";

    // Run the SQL against the database.
    await this.pool.batch(sql, tables).catch((error) => {
      // Log any errors that occur.
      this.logger.error(error);
    });
  }

  // Gets all the table records from the tables table
  public async getTables() {
    const sql =
      "SELECT room, tableID, tableName, visible, QRCodePath " +
      `FROM ${this.schema}.tables`;
    let tables: ITable[] = [];

    // Run the SQL against the database.
    await this.pool
      .query(sql)
      .then((rows) => {
        // For each row, add a Table object to tables array.
        if (typeof rows === "object" && rows?.length > 0) {
          tables = rows.map((row: any) => ({
            room: row.room,
            tableID: row.tableID,
            tableName: row.tableName,
            visible: row.visible,
            QRCodePath: row.QRCodePath,
          }));
        }
      })
      .catch((error) => {
        // Log any errors that occur.
        this.logger.error(error);
      });

    // Return the tables.
    return tables;
  }

  // Gets all visible tables from the tables table.
  public async getVisibleTables() {
    const sql =
      "SELECT room, tableID, tableName, visible, QRCodePath " +
      `FROM ${this.schema}.tables WHERE visible = 1`;
    let tables: ITable[] = [];

    // Run the SQL against the database.
    await this.pool
      .query(sql)
      .then((rows) => {
        // For each row, add a Table object to tables array.
        if (typeof rows === "object" && rows?.length > 0) {
          tables = rows.map((row: any) => ({
            room: row.room,
            tableID: row.tableID,
            tableName: row.tableName,
            visible: row.visible,
            QRCodePath: row.QRCodePath,
          }));
        }
      })
      .catch((error) => {
        // Log any errors that occur.
        this.logger.error(error);
      });

    // Return visible tables.
    return tables;
  }

  // Gets QR data for table record matching the given tableID.
  public async getQRData(tableID: string) {
    const sql =
      `SELECT QRCodeData FROM ${this.schema}.tables ` +
      "WHERE tableID = :tableID";
    let qrCodeData: IQRCode = {
      QRCodeData: "",
    };

    // Run the SQL against the database.
    await this.pool
      .query(sql, { tableID })
      .then((rows) => {
        // Add the QR Code data to the qrCodeData object.
        if (typeof rows === "object" && rows?.length === 1) {
          qrCodeData = {
            QRCodeData: rows[0].QRCodeData,
          };
        }
      })
      .catch((error) => {
        // Log any errors that occur.
        this.logger.error(error);
      });

    // Return the QR Code Data.
    return qrCodeData;
  }
}
