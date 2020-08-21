import { config } from "dotenv";
import { PoolConfig } from "mariadb";
import * as process from "process";
import { IEnvironmentOptions } from "./interfaces/environmentOptions.interface";

export class Config {
  public env: string;
  public port: number;
  public localHost: string;
  public restifyHost: string;
  public authPassword: string | undefined;
  public authUsername: string | undefined;
  public certURI: string | undefined;
  public keyURI: string | undefined;
  public origins: string[];
  public mariaDB: PoolConfig;

  constructor({
    env: env,
    port: port,
    localHost: localHost,
    restifyHost: restifyHost,
    authPassword: authPassword,
    authUsername: authUsername,
    certURI: certURI,
    keyURI: keyURI,
    origins: origins,
    mariaDB: mariaDB,
  }: IEnvironmentOptions = {}) {
    if (
      typeof process.env.NODE_ENV === "undefined" ||
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      config();
    }

    this.env = env || process.env.NODE_ENV || "development";
    this.port =
      port || typeof process.env.PORT === "string" ? +process.env.PORT! : 8080;
    this.localHost = localHost || process.env.LOCAL_HOST || "localhost";
    this.restifyHost = restifyHost || process.env.RESTIFY_HOST || "localhost";
    this.authPassword = authPassword || process.env.AUTH_PASSWORD || undefined;
    this.authUsername = authUsername || process.env.AUTH_USERNAME || undefined;
    this.certURI = certURI || process.env.CERT_URI || undefined;
    this.keyURI = keyURI || process.env.KEY_URI || undefined;
    this.origins = origins?.split(",") ||
      process.env.ORIGINS?.split(",") || ["http://localhost:3000"];
    this.mariaDB = {
      host: mariaDB?.host || process.env.MARIA_DB_HOST || "localhost",
      user: mariaDB?.user || process.env.MARIA_DB_USER || "",
      password: mariaDB?.password || process.env.MARIA_DB_PASSWORD || "",
      connectionLimit:
        mariaDB?.connectionLimit ||
        typeof process.env.MARIA_DB_CONNECTION_LIMIT === "string"
          ? +(process.env.MARIA_DB_CONNECTION_LIMIT as string)
          : 10,
    };
  }
}
