import { readFileSync } from "fs";
import * as restify from "restify";
import { Config } from "../config/config";
import { JohnnysBurgerBarRestaurantController } from "../controllers/johnnysBurgerBarRestaurant";
import { QRCodeController } from "../controllers/qrCode";
import { Database } from "../database/database";
import { Auth } from "../middleware/auth";
import { Cors } from "../middleware/cors";
import { Routes } from "../routes/routes";
import { RoutesConfig } from "../routes/routesConfig";
import { Server } from "../services/server";

export class Services {
  private config: Config | undefined;
  private server: Server | undefined;
  private auth: Auth | undefined;
  private cors: Cors | undefined;
  private restifyServer: restify.Server | undefined;
  private routes: Routes | undefined;
  private JBBRController: JohnnysBurgerBarRestaurantController | undefined;
  private QRCodeController: QRCodeController | undefined;
  private routesConfig: RoutesConfig | undefined;
  private database: Database | undefined;

  constructor(config: Config = new Config()) {
    this.config = config;
  }

  public async boot() {
    await this.getDatabase().start();
  }

  public getConfig() {
    if (this.config) {
      return this.config;
    }

    this.config = new Config();

    return this.config;
  }

  public getDatabase() {
    if (this.database) {
      return this.database;
    }

    this.database = new Database(this.getConfig());

    return this.database;
  }

  public getAuth() {
    if (this.auth) {
      return this.auth;
    }

    this.auth = new Auth(this.getRestifyServer(), this.getConfig());

    return this.auth;
  }

  public getCors() {
    if (this.cors) {
      return this.cors;
    }

    this.cors = new Cors(this.getRestifyServer(), this.getConfig());

    return this.cors;
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

  public getRoutesConfig() {
    if (this.routesConfig) {
      return this.routesConfig;
    }

    this.routesConfig = new RoutesConfig();

    return this.routesConfig;
  }

  public getJBBRController() {
    if (this.JBBRController) {
      return this.JBBRController;
    }

    this.JBBRController = new JohnnysBurgerBarRestaurantController(
      this.getDatabase(),
      this.getConfig()
    );

    return this.JBBRController;
  }

  public getQRCodeController() {
    if (this.QRCodeController) {
      return this.QRCodeController;
    }

    this.QRCodeController = new QRCodeController();

    return this.QRCodeController;
  }

  public getRoutes() {
    if (this.routes) {
      return this.routes;
    }

    this.routes = new Routes(
      this.getRestifyServer(),
      this.getRoutesConfig(),
      this.getJBBRController(),
      this.getQRCodeController()
    );

    return this.routes;
  }

  public getServer() {
    if (this.server) {
      return this.server;
    }

    this.getAuth();
    this.getCors();
    this.getRoutes();
    this.server = new Server(this.getRestifyServer(), this.getConfig());

    return this.server;
  }
}
