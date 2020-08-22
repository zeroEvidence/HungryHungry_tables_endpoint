import { Promise } from "bluebird";
import * as QRCode from "qrcode";
import { Config } from "../config/config";
import { Instance } from "../config/instance";
import { Strings } from "../config/strings";
import { IQRTable } from "../interfaces/qrTable.interface";
import { ITable } from "../interfaces/table.interface";
import { ITables } from "../interfaces/tables.interface";
import { TableRepository } from "../repository/tableRepository";
import { RoutesConfig } from "../routes/routesConfig";
import { Logger } from "../utils/logger";
import joi = require("joi");

export class Restaurant {
  private _tables: Promise<ITables>;
  private routesConfig: RoutesConfig;

  constructor(
    private tableRepo: TableRepository,
    private config: Config,
    private _logger: Logger,
    private _instance: Instance,
    private _strings: Strings
  ) {
    this._tables = Promise.resolve({});
    this.routesConfig = new RoutesConfig();
  }

  public set tables(tables: Promise<ITables>) {
    this._tables = tables.then((newTables) =>
      this.validateTables(newTables).then(async (validTables) => {
        await this.saveTables(validTables);

        return validTables;
      })
    );
  }

  public get tables(): Promise<ITables> {
    return this._tables;
  }

  public get availableTables(): Promise<ITable[]> {
    return this.tables.then(() => {
      return this.tableRepo.getVisibleTables();
    });
  }

  public get logger() {
    return this._logger;
  }

  public get instance() {
    return this._instance;
  }

  public get strings() {
    return this._strings;
  }

  private async saveTables(validatedTables: ITables) {
    let tables: ITable[] = [];

    try {
      tables = await this.tableRepo.getTables();
    } catch (error) {
      this.logger.error(error);
    }

    const rooms = Object.keys(validatedTables);
    const qrTables: IQRTable[] = [];

    await Promise.each(rooms, async (room) => {
      const roomTables = validatedTables[room].tables;
      const tableIDs = Object.keys(roomTables);

      await Promise.each(tableIDs, async (tableID) => {
        const isTableNotInDB = !tables.some((table) => {
          return (
            table.room === room &&
            table.tableID === tableID &&
            table.tableName === roomTables[tableID].name &&
            table.visible === roomTables[tableID].visible
          );
        });

        if (isTableNotInDB) {
          const qrCodeData = await QRCode.toDataURL(
            this._instance.hungryhungryQRTableUri.replace(":tableID:", tableID)
          );

          qrTables.push({
            room,
            tableID,
            tableName: roomTables[tableID].name,
            visible: roomTables[tableID].visible,
            QRCodeData: qrCodeData,
            QRCodePath: `http://${this.config.localHost}:${
              this.config.port
            }${this.routesConfig.routes.tables.qrCode.replace(
              ":tableid",
              tableID
            )}`,
          });
        }
      });
    });

    if (qrTables.length >= 1) {
      try {
        await this.tableRepo.insertTables(qrTables);
      } catch (error) {
        this._logger.error(error);
      }
    }
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

    if (typeof tables !== "object") {
      throw new Error(
        this._strings.incomingTablesNotAnObject.replace(
          ":tables:",
          JSON.stringify(tables)
        )
      );
    }

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
              this._strings.invalidKeyNameInTables.replace(":room:", ordinal)
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
                this._strings.invalidObjectInTables
                  .replace(":room:", ordinal)
                  .replace(":tableKey:", tableKey)
              );
            });
        });
      }),
    ]).then(() => tables);
  }
}
