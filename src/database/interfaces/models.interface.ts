import { Model } from "mongoose";
import { ITableDocument } from "../../models/interfaces/tableDocument.interface";

export interface IModels {
  Table: Model<ITableDocument>;
}
