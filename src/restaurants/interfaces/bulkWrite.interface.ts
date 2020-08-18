import { ITable } from "./table.interface";

export interface IBulkWrite {
  insertOne?: {
    document: ITable;
  };
  updateOne?: {
    document: ITable;
  };
}
