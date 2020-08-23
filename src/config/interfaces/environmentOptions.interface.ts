import { PoolConfig } from "mariadb";
import { ILoggerEnvironmentOptions } from "./loggerEnvironmentOptions.interface";

// Describes the accepted environment options which can be passed into Config
export interface IEnvironmentOptions {
  // the current environment node.js is running in, e.g. "test", "development",
  // "production".
  env?: string | undefined;
  // the port number for restify to listen on.
  port?: number | undefined;
  // the hostname for the QRCode path URL.
  localHost?: string;
  // the hostname for restify to listen on.
  restifyHost?: string;
  // the authentication password to access this service.
  authPassword?: string | undefined;
  // the authentication username to access this service.
  authUsername?: string | undefined;
  // optional cert path, for using https
  certURI?: string | undefined;
  // optional key path, for using https
  keyURI?: string | undefined;
  // allowed origins, i.e. the hostname of the tables-ui project
  // separated by commas, e.g. http://localhost:3000,http://someotherhost
  origins?: string | undefined;
  // mariaDB Pool config. Refer to README.md for more info.
  mariaDB?: PoolConfig | undefined;
  // the database name to use on mariaDB
  database?: string | undefined;
  // the logger config, Refer to loggerEnvironmentOptions file or README.md for
  // more info.
  logger?: ILoggerEnvironmentOptions | undefined;
}
