import * as process from "process";
import { IEnvironmentOptions } from "./interfaces/environmentOptions.interface";

export class Config {
  public env: string;
  public port: number;
  public localHost: string;
  public dockerHost: string;
  public authPassword: string | undefined;
  public authUsername: string | undefined;
  public certURI: string | undefined;
  public keyURI: string | undefined;
  public mongoDBURI: string;
  public origins: string[];

  constructor({
    env: env,
    port: port,
    localHost: localHost,
    dockerHost: dockerHost,
    authPassword: authPassword,
    authUsername: authUsername,
    certURI: certURI,
    keyURI: keyURI,
    mongoDBURI: mongoDBURI,
    origins: origins,
  }: IEnvironmentOptions = {}) {
    this.env = env || process.env.NODE_ENV || "development";
    this.port =
      port || typeof process.env.PORT === "string" ? +process.env.PORT! : 8080;
    this.localHost = localHost || process.env.LOCAL_HOST || "localhost";
    this.dockerHost = dockerHost || process.env.DOCKER_HOST || "localhost";
    this.authPassword = authPassword || process.env.AUTHPASSWORD || undefined;
    this.authUsername = authUsername || process.env.AUTHUSERNAME || undefined;
    this.certURI = certURI || process.env.CERTURI || undefined;
    this.keyURI = keyURI || process.env.KEYURI || undefined;
    this.mongoDBURI =
      mongoDBURI ||
      process.env.MONGODBURI ||
      "mongodb://localhost:27017/hungryhungry";
    this.origins = origins?.split(",") ||
      process.env.ORIGINS?.split(",") || ["http://localhost:3000"];
  }
}
