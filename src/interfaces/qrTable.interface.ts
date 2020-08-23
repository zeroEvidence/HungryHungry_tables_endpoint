import { IQRCode } from "./qrCode.interface";
import { ITable } from "./table.interface";

// Describes the object which is a mix of the Table and QRCode for the database.
export interface IQRTable extends ITable, IQRCode {}
