import { Config } from "../config/config";
import { Auth } from "../middleware/auth";
import { Server } from "../server";

export class Services {
  private config: Config | undefined;
  private server: Server | undefined;
  private auth: Auth | undefined;

  constructor(config: Config = new Config()) {
    this.config = config;
  }

  public getConfig() {
    if (this.config) {
      return this.config;
    }

    this.config = new Config();

    return this.config;
  }

  public getAuth() {
    if (this.auth) {
      return this.auth;
    }

    this.auth = new Auth(this.getConfig());

    return this.auth;
  }

  public getServer() {
    if (this.server) {
      return this.server;
    }

    this.server = new Server(this.getConfig(), this.getAuth());

    return this.server;
  }
}
