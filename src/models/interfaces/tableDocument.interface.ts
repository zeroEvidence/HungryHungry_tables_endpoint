import { Document } from "mongoose";

export interface ITableDocument extends Document {
  room: string;
  tableID: string;
  tableName: string;
  visible: number;
  QRCodePath: string;
}
