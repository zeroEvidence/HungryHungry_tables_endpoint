import { Pool } from "mariadb";
import { Config } from "../config/config";
import { Database } from "../database/database";
import { IQRCode } from "../interfaces/qrCode.interface";
import { IQRTable } from "../interfaces/qrTable.interface";
import { ITable } from "../interfaces/table.interface";
import { Logger } from "../utils/logger";

export class TableRepository {
  private pool: Pool;
  private schema: string;

  constructor(
    private database: Database,
    private config: Config,
    private logger: Logger
  ) {
    this.pool = this.database.pool;
    this.schema = this.config.database;
  }

  public async setup() {
    try {
      await this.createSchema();
      await this.createTable();
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async createSchema() {
    const sql = `CREATE SCHEMA IF NOT EXISTS ${this.schema};`;

    await this.pool.query(sql).catch((error) => {
      this.logger.error(error);
    });
  }

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

    await this.pool.query(sql).catch((error) => {
      this.logger.error(error);
    });
  }

  public async insertTables(tables: IQRTable[]) {
    const sql =
      `INSERT INTO ${this.schema}.tables(room, tableID, tableName, visible, ` +
      "QRCodePath, QRCodeData) " +
      "VALUES (:room, :tableID, :tableName, :visible, :QRCodePath, " +
      ":QRCodeData) " +
      `ON DUPLICATE KEY UPDATE tableID=':tableID'`;

    await this.pool.batch(sql, tables).catch((error) => {
      this.logger.error(error);
    });
  }

  public async getTables() {
    const sql =
      "SELECT room, tableID, tableName, visible, QRCodePath " +
      `FROM ${this.schema}.tables`;
    let tables: ITable[] = [];

    await this.pool
      .query(sql)
      .then((rows) => {
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
        this.logger.error(error);
      });

    return tables;
  }

  public async getVisibleTables() {
    const sql =
      "SELECT room, tableID, tableName, visible, QRCodePath " +
      `FROM ${this.schema}.tables WHERE visible = 1`;
    let tables: ITable[] = [];

    await this.pool
      .query(sql)
      .then((rows) => {
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
        this.logger.error(error);
      });

    return tables;
  }

  public async getQRData(tableID: string) {
    const sql =
      `SELECT QRCodeData FROM ${this.schema}.tables ` +
      "WHERE tableID = :tableID";
    let qrCodeData: IQRCode = {
      QRCodeData: "",
    };

    await this.pool
      .query(sql, { tableID })
      .then((rows) => {
        if (typeof rows === "object" && rows?.length === 1) {
          qrCodeData = {
            QRCodeData: rows[0].QRCodeData,
          };
        }
      })
      .catch((error) => {
        this.logger.error(error);
      });

    return qrCodeData;
  }
}
