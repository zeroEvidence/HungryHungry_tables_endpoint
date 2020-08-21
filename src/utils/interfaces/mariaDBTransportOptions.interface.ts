import Transport = require("winston-transport");
import { Pool } from "mariadb";

export interface IMariaDBTransportOptions
  extends Transport.TransportStreamOptions {
  label?: string;
  tableName?: string;
  connection?: {
    charset?: string;
    collate?: string;
  };
  databasePool: Pool;
  databaseName: string;
}
