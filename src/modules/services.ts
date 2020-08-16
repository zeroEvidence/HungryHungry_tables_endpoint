import { readFileSync } from "fs";
import * as restify from "restify";
import { Config } from "../config/config";
import { Auth } from "../middleware/auth";
import { Server } from "../server";

export class Services {
  private config: Config | undefined;
  private server: Server | undefined;
  private auth: Auth | undefined;
  private restifyServer: restify.Server | undefined;

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

    this.auth = new Auth(this.getRestifyServer(), this.getConfig());

    return this.auth;
  }

  public getRestifyServer() {
    if (this.restifyServer) {
      return this.restifyServer;
    }

    const options: restify.ServerOptions = {};
    const config: Config = this.getConfig();

    if (
      typeof config.keyURI === "string" &&
      typeof config.certURI === "string"
    ) {
      options.key = readFileSync(config.keyURI, "utf8");
      options.certificate = readFileSync(config.certURI, "utf8");
    }

    this.restifyServer = restify.createServer(options);

    return this.restifyServer;
  }

  public getServer() {
    if (this.server) {
      return this.server;
    }

    this.getAuth();
    this.server = new Server(this.getRestifyServer(), this.getConfig());

    return this.server;
  }
}
