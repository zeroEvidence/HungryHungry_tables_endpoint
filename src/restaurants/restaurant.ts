import { Promise } from "bluebird";
import { Config } from "../config/config";
import { Database } from "../database/database";
import { IAvailableTables } from "../interfaces/availableTables.interface";
import { ITables } from "../interfaces/tables.interface";
import { ITableDocument } from "../models/interfaces/tableDocument.interface";
import { RoutesConfig } from "../routes/routesConfig";
import { IBulkWrite } from "./interfaces/bulkWrite.interface";
import { ITable } from "./interfaces/table.interface";
import joi = require("joi");

export class Restaurant {
  private _tables: Promise<ITables>;
  private routesConfig: RoutesConfig;

  constructor(private db: Database, private config: Config) {
    this._tables = Promise.resolve({});
    this.routesConfig = new RoutesConfig();
  }

  public set tables(tables: Promise<ITables>) {
    this._tables = tables.then((newTables) =>
      this.validateTables(newTables).then((validTables) => {
        this.saveTables(validTables);
        return validTables;
      })
    );
  }

  public get tables(): Promise<ITables> {
    return this._tables;
  }

  public get availableTables(): Promise<IAvailableTables> {
    return this.tables.then(async (tables) => {
      const availableTables = {} as IAvailableTables;
      const ordinals = Object.keys(tables);

      await Promise.each(ordinals, async (ordinal) => {
        const tableKeys = Object.keys(tables[ordinal].tables);

        await Promise.each(tableKeys, (tableKey) => {
          if (tables[ordinal].tables[tableKey].visible === 1) {
            if (typeof availableTables[ordinal] !== "object") {
              availableTables[ordinal] = {
                name: tables[ordinal].name,
                tables: {},
              };
            }

            availableTables[ordinal].tables[tableKey] =
              tables[ordinal].tables[tableKey];
          }
        });
      });

      return availableTables;
    });
  }

  private async saveTables(validatedTables: ITables) {
    const rooms = Object.keys(validatedTables);
    const tablesDB = this.db.models.Table;
    const tablesResults = await tablesDB.find({}).exec();
    const tablesToCreate: ITable[] = [];
    const tablesToUpdate: ITable[] = [];

    await Promise.each(rooms, async (room) => {
      const roomTables = validatedTables[room].tables;
      const tableIDs = Object.keys(roomTables);

      await Promise.each(tableIDs, async (tableID) => {
        const newTable: ITable = {
          room,
          tableID,
          tableName: roomTables[tableID].name,
          visible: roomTables[tableID].visible,
          QRCodePath: `http://${this.config.host}:${
            this.config.port
          }${this.routesConfig.routes.tables.qrImg.replace(
            ":tableid",
            tableID
          )}`,
        };

        if (tablesResults === null || tablesResults.length === 0) {
          tablesToCreate.push(newTable);
        } else {
          let tableFound = false;

          await Promise.each(tablesResults, (tableResult) => {
            if (tableResult.tableID === newTable.tableID) {
              tableFound = true;
              if (!this.compareObjects(tableResult, newTable)) {
                tablesToUpdate.push(newTable);
              }
            }
          });

          if (tableFound === false) {
            tablesToCreate.push(newTable);
          }
        }
      });
    });

    const bulkWrite: IBulkWrite[] = [];
    if (tablesToCreate.length > 0) {
      bulkWrite.concat(
        tablesToCreate.map((table) => ({
          insertOne: {
            document: table,
          },
        }))
      );
    }

    if (tablesToUpdate.length > 0) {
      bulkWrite.concat(
        tablesToUpdate.map((table) => ({
          updateOne: {
            document: table,
          },
        }))
      );
    }

    if (bulkWrite.length > 0) {
      tablesDB.bulkWrite(bulkWrite);
    }
  }

  private compareObjects(tableResult: ITableDocument, newTable: ITable) {
    if (
      tableResult.room === newTable.room &&
      tableResult.tableID === newTable.tableID &&
      tableResult.tableName === newTable.tableName &&
      tableResult.visible === newTable.visible &&
      tableResult.QRCodePath === newTable.QRCodePath
    ) {
      return true;
    }

    return false;
  }

  private validateTables(tables: ITables): Promise<ITables> {
    // Validate as much as we can, joi can't validate the inner "tables" object
    // as it appears to have variable keys.
    const tablesSchema = joi.object().keys({
      Front: joi
        .object({
          name: joi.string().valid("Front").required(),
          tables: joi.object().required(),
          active_tables: joi.number().integer().min(0).required(),
          is_legacy: joi.string().valid("false", "true").required(),
        })
        .required(),
      Back: joi
        .object({
          name: joi.string().valid("Back").required(),
          tables: joi.object().required(),
          active_tables: joi.number().integer().min(0).required(),
          is_legacy: joi.string().valid("false", "true").required(),
        })
        .required(),
      A: joi.object({
        name: joi.string().valid("A").required(),
        tables: joi.object().required(),
        active_tables: joi.number().integer().min(0).required(),
        is_legacy: joi.string().valid("false", "true").required(),
      }),
    });
    // schema to check the tables keys.
    const ordinalTableKeysSchema = joi
      .array()
      .items(joi.string().pattern(/\d+/));
    // schema to check the inner table object within each.
    const tableSchema = joi.object({
      name: joi
        .string()
        .pattern(/(?:\d+)|(?:Invalid table name)|(?:Space)/)
        .required(),
      visible: joi.number().integer().min(0).max(1).required(),
    });
    // get an array of ordinal locations.
    const ordinals = Object.keys(tables);

    return Promise.all([
      // Error to be thrown to up the stack if it invalidates.
      tablesSchema.validateAsync(tables).catch((err) => {
        throw new Error(err);
      }),
      // for each location
      Promise.each(ordinals, (ordinal) => {
        const ordinalTables = tables[ordinal].tables;
        const ordinalTableKeys = Object.keys(ordinalTables);

        // validate that all the table keys are digits.
        return ordinalTableKeysSchema
          .validateAsync(ordinalTableKeys)
          .catch(() => {
            // the caught error wouldn't make much sense, so throwing a sensible one.
            throw new Error(
              `Invalid key name within tables data: tables.${ordinal}.tables`
            );
          });
      }),
      // for each location
      Promise.each(ordinals, (ordinal) => {
        const ordinalTables = tables[ordinal].tables;
        const ordinalTableKeys = Object.keys(ordinalTables);

        // for each of the table keys...
        return Promise.each(ordinalTableKeys, (tableKey) => {
          // validate the object for each key.
          return tableSchema
            .validateAsync(ordinalTables[tableKey])
            .catch(() => {
              // the caught error wouldn't make much sense, so throwing a sensible one.
              throw new Error(
                `Invalid table object within tables data: tables.${ordinal}.tables.${tableKey}`
              );
            });
        });
      }),
    ]).then(() => tables);
  }
}
