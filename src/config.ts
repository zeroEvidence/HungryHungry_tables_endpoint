import * as process from "process";
import { IEnvironmentOptions } from "./interfaces/environmentOptions.interface";

export class Config {
  public env: string;
  public port: number;
  public host: string;
  public authPassword: string | undefined;
  public authUsername: string | undefined;
  public certURI: string | undefined;
  public keyURI: string | undefined;

  constructor({
    env: env,
    port: port,
    host: host,
    authPassword: authPassword,
    authUsername: authUsername,
    certURI: certURI,
    keyURI: keyURI,
  }: IEnvironmentOptions = {}) {
    this.env = env || process.env.NODE_ENV || "development";
    this.port =
      port || typeof process.env.PORT === "string" ? +process.env.PORT! : 8080;
    this.host = host || process.env.HOST || "localhost";
    this.authPassword = authPassword || process.env.AUTHPASSWORD || undefined;
    this.authUsername = authUsername || process.env.AUTHUSERNAME || undefined;
    this.certURI = certURI || process.env.CERTURI || undefined;
    this.keyURI = keyURI || process.env.KEYURI || undefined;
  }
}
