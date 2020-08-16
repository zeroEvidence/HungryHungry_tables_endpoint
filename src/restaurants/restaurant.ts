import { Promise } from "bluebird";
import { IAvailableTables } from "../interfaces/availableTables.interface";
import { ITables } from "../interfaces/tables.interface";
import joi = require("joi");

export class Restaurant {
  private _tables: Promise<ITables>;

  constructor() {
    this._tables = Promise.resolve({});
  }

  public set tables(tables: Promise<ITables>) {
    this._tables = tables.then((newTables) => this.validateTables(newTables));
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
