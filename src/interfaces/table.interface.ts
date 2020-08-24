// Describes the Table object coming from the database.
export interface ITable {
  room: string;
  tableID: string;
  tableName: string;
  visible: number;
  QRCodePath: string;
}
