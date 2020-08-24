import { Pool } from "mariadb";

// Defines Logger options for the database transport.
export interface IMariaDBTransportOptions {
  // The name of the table to put the logs into.
  tableName?: string;
  // The connection charset and collate.
  connection?: {
    charset?: string;
    collate?: string;
  };
  // The database pool.
  databasePool: Pool;
  // The database/schema name.
  databaseName: string;
}
