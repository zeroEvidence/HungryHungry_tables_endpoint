import { PoolConfig } from "mariadb";

export interface IEnvironmentOptions {
  env?: string | undefined;
  port?: number | undefined;
  localHost?: string;
  restifyHost?: string;
  authPassword?: string | undefined;
  authUsername?: string | undefined;
  certURI?: string | undefined;
  keyURI?: string | undefined;
  origins?: string | undefined;
  mariaDB?: PoolConfig | undefined;
}
