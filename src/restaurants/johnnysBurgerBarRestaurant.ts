import { Promise } from "bluebird";
import fetch from "node-fetch";
import { IAvailableTables } from "../interfaces/availableTables.interface";
import { ITables } from "../interfaces/tables.interface";
import { Restaurant } from "./restaurant";

export class JohnnysBurgerBarRestaurant extends Restaurant {
  constructor(
    private tablesURI = "https://hungryhungry.com/helping-hospo/hh_test_tabledata.json"
  ) {
    super();

    this.tables = this.fetchTables();
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

  private fetchTables(): Promise<ITables> {
    return fetch(this.tablesURI).then((res) => res.json());
  }
}
