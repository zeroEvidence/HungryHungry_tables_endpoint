import { Promise } from "bluebird";
import { IAvailableTables } from "../interfaces/availableTables.interface";
import { ITables } from "../interfaces/tables.interface";

export class Restaurant {
  private _tables: Promise<ITables>;

  constructor() {
    this._tables = Promise.resolve({});
  }

  public set tables(tables: Promise<ITables>) {
    this._tables = tables;
  }

  public get tables(): Promise<ITables> {
    return this._tables;
  }

  public get availableTables(): Promise<IAvailableTables> {
    return Promise.resolve({});
  }

  private validateTables(tables: ITables): ITables {
    return tables;
  }
}
