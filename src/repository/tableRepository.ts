import { Pool } from "mariadb";
import { Config } from "../config/config";
import { Database } from "../database/database";
import { IQRCode } from "../interfaces/qrCode.interface";
import { IQRTable } from "../interfaces/qrTable.interface";
import { ITable } from "../interfaces/table.interface";

export class TableRepository {
  private pool: Pool;
  private schema: string;

  constructor(private database: Database, private config: Config) {
    this.pool = this.database.pool;
    this.schema = "hungryhungry";
  }

  public async setup() {
    try {
      await this.createSchema();
      await this.createTable();
    } catch (error) {
      console.error(error);
    }
  }

  public async createSchema() {
    const connection = await this.pool.getConnection();
    const sql = `CREATE SCHEMA IF NOT EXISTS ${this.schema};`;

    try {
      await connection.query(sql);
    } catch (error) {
      console.error(error);
    } finally {
      await connection.end();
    }
  }

  public async createTable() {
    const connection = await this.pool.getConnection();
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

    try {
      await connection.query(sql);
    } catch (error) {
      console.error(error);
    } finally {
      await connection.end();
    }
  }

  public async insertTables(tables: IQRTable[]) {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const sql =
        `INSERT INTO ${this.schema}.tables(room, tableID, tableName, visible, QRCodePath, ` +
        "QRCodeData) " +
        "VALUES (:room, :tableID, :tableName, :visible, :QRCodePath, " +
        ":QRCodeData) " +
        `ON DUPLICATE KEY UPDATE tableID=':tableID'`;

      await connection.batch(sql, tables);

      await connection.commit();
    } catch (error) {
      console.error(error);
      await connection.rollback();
    } finally {
      await connection.end();
    }
  }

  public async getTables() {
    const sql = `SELECT room, tableID, tableName, visible, QRCodePath FROM ${this.schema}.tables`;
    const connection = await this.pool.getConnection();
    let tables: ITable[] = [];

    try {
      const rows = await connection.query(sql);

      if (typeof rows === "object" && rows?.length > 0) {
        tables = rows.map((row: any) => ({
          room: row.room,
          tableID: row.tableID,
          tableName: row.tableName,
          visible: row.visible,
          QRCodePath: row.QRCodePath,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      await connection.end();
    }

    return tables;
  }

  public async getVisibleTables() {
    const sql = `SELECT room, tableID, tableName, visible, QRCodePath FROM ${this.schema}.tables WHERE visible = 1`;
    const connection = await this.pool.getConnection();
    let tables: ITable[] = [];

    try {
      const rows = await connection.query(sql);

      if (typeof rows === "object" && rows?.length > 0) {
        tables = rows.map((row: any) => ({
          room: row.room,
          tableID: row.tableID,
          tableName: row.tableName,
          visible: row.visible,
          QRCodePath: row.QRCodePath,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      await connection.end();
    }

    return tables;
  }

  public async getQRData(tableID: string) {
    const sql = `SELECT QRCodeData FROM ${this.schema}.tables WHERE tableID = :tableID`;
    const connection = await this.pool.getConnection();
    let qrCodeData: IQRCode = {
      QRCodeData: "",
    };

    try {
      const rows = await connection.query(sql, { tableID });

      if (typeof rows === "object" && rows?.length === 1) {
        qrCodeData = {
          QRCodeData: rows[0].QRCodeData,
        };
      }
    } catch (error) {
      console.error(error);
    } finally {
      await connection.end();
    }

    return qrCodeData;
  }
}
