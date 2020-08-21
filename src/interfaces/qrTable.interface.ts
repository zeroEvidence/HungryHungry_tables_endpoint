import { IQRCode } from "./qrCode.interface";
import { ITable } from "./table.interface";

export interface IQRTable extends ITable, IQRCode {}
