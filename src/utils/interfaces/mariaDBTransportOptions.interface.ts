import { Pool } from "mariadb";

export interface IMariaDBTransportOptions {
  tableName?: string;
  connection?: {
    charset?: string;
    collate?: string;
  };
  databasePool: Pool;
  databaseName: string;
}
