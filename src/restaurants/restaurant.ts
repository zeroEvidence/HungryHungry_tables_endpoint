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

// The parent class of all restaurants, contains methods and properties shared
// amongst all restaurants.
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
    // Need to set the tables property in the constructor, should immediately
    // be overwritten by the constructor in the child class.
    this._tables = Promise.resolve({});
    // Instantiate new RoutesConfig.
    this.routesConfig = new RoutesConfig();
  }

  // Sets the tables property.
  public set tables(tables: Promise<ITables>) {
    // Set the tables property once the incoming tables variable has resolved,
    // validated, and saved to the database.
    this._tables = tables.then((newTables) =>
      // Validate the incoming tables data.
      this.validateTables(newTables).then(async (validTables) => {
        // Once validated, save the tables data to the database.
        await this.saveTables(validTables);

        // Set the tables property to the validated tables.
        return validTables;
      })
    );
  }

  // Get the raw validated tables data from HungryHungry's endpoint.
  public get tables(): Promise<ITables> {
    return this._tables;
  }

  // Get the available tables from the TablesRepository.
  public get availableTables(): Promise<ITable[]> {
    // Once tables has been set...
    return this.tables.then(() => {
      // Get the available tables from the TablesRepository.
      return this.tableRepo.getVisibleTables();
    });
  }

  // Get the QR Code data for the specific tableId.
  public getQRData(tableId: string) {
    return this.tableRepo.getQRData(tableId);
  }

  // Get the Logger object.
  protected get logger() {
    return this._logger;
  }

  // Get the Instance object.
  protected get instance() {
    return this._instance;
  }

  // Get the Strings object.
  protected get strings() {
    return this._strings;
  }

  // Saves validated tables to the database/
  private async saveTables(validatedTables: ITables) {
    let tables: ITable[] = [];

    try {
      // Get all the table records as an array of Table objects.
      tables = await this.tableRepo.getTables();
    } catch (error) {
      // If there are any errors, log them.
      this.logger.error(error);
    }

    // Get an array of table keys, i.e. rooms.
    const rooms = Object.keys(validatedTables);
    const qrTables: IQRTable[] = [];

    // For each room.
    await Promise.each(rooms, async (room) => {
      // Get the tables in the room.
      const roomTables = validatedTables[room].tables;
      // Get the table IDs of each table in the room.
      const tableIDs = Object.keys(roomTables);

      // For each table ID
      await Promise.each(tableIDs, async (tableID) => {
        // Is this incoming table NOT already in the database?
        const isTableNotInDB = !tables.some((table) => {
          return (
            table.room === room &&
            table.tableID === tableID &&
            table.tableName === roomTables[tableID].name &&
            table.visible === roomTables[tableID].visible
          );
        });

        // If it's NOT in the database
        if (isTableNotInDB) {
          // Generate the corresponding QR Code.
          const qrCodeData = await QRCode.toDataURL(
            this._instance.hungryhungryQRTableUri.replace(":tableID:", tableID)
          );

          // Add the incoming table to the array to be created/updated.
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

    // If the incoming table data has at least one change...
    if (qrTables.length >= 1) {
      try {
        // Insert the new/updated record into the database.
        await this.tableRepo.insertTables(qrTables);
      } catch (error) {
        // If there is an error, log it.
        this._logger.error(error);
      }
    }
  }

  // Validates the incoming tables data.
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
      A: joi
        .object({
          name: joi.string().valid("A").required(),
          tables: joi.object().required(),
          active_tables: joi.number().integer().min(0).required(),
          is_legacy: joi.string().valid("false", "true").required(),
        })
        .required(),
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

    // If tables is NOT an object.
    if (typeof tables !== "object") {
      // Throw new error.
      throw new Error(
        this._strings.incomingTablesNotAnObject.replace(
          ":tables:",
          JSON.stringify(tables)
        )
      );
    }

    // get an array of ordinal locations.
    const ordinals = Object.keys(tables);

    // When all promises resolve, return tables object.
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
      // If all the above validates, then give back tables object.
    ]).then(() => tables);
  }
}
