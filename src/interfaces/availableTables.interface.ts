import { IAvailableOrdinalTables } from "./availableOrdinalTables.interface";

export interface IAvailableTables {
  Front: IAvailableOrdinalTables;
  Back: IAvailableOrdinalTables;
  [index: string]: IAvailableOrdinalTables;
}
