import { readFileSync } from "fs";
import * as restify from "restify";
import { createLogger, format, Logger, transport, transports } from "winston";
import { Config } from "../config/config";
import { JohnnysBurgerBarRestaurantController } from "../controllers/johnnysBurgerBarRestaurant";
import { QRCodeController } from "../controllers/qrCode";
import { Database } from "../database/database";
import { Auth } from "../middleware/auth";
import { Cors } from "../middleware/cors";
import { TableRepository } from "../repository/tableRepository";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";
import { Routes } from "../routes/routes";
import { RoutesConfig } from "../routes/routesConfig";
import { Server } from "../services/server";
import { WinstonMariaDBTransport } from "../utils/winstonMariaDBTransport";

export class Services {
  private config: Config | undefined;
  private server: Server | undefined;
  private auth: Auth | undefined;
  private cors: Cors | undefined;
  private restifyServer: restify.Server | undefined;
  private routes: Routes | undefined;
  private jbbrController: JohnnysBurgerBarRestaurantController | undefined;
  private qrCodeController: QRCodeController | undefined;
  private routesConfig: RoutesConfig | undefined;
  private database: Database | undefined;
  private tableRepository: TableRepository | undefined;
  private jbbr: JohnnysBurgerBarRestaurant | undefined;
  private logger: Logger | undefined;

  constructor(config: Config = new Config()) {
    this.config = config;
  }

  public async boot() {
    await this.getDatabase().start();

    // This will fetch the tables from the HungryHungry endpoint
    // and save them to the database along with their QRCodes data.
    const jbbr = await this.getJBBR();
    const oneHour = 1000 * 60 * 60;

    // This will do the above every hour.
    setInterval(() => {
      jbbr.fetchTables();
    }, oneHour);
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

  public getLogger() {
    if (this.logger) {
      return this.logger;
    }

    const config = this.getConfig();
    const transportsOptions: transport[] = [];

    if (
      config.winston.transports?.some(
        (transportType) => transportType === "file"
      ) &&
      typeof config.winston.fileLogLevel === "string" &&
      typeof config.winston.fileLogPath === "string"
    ) {
      transportsOptions.push(
        new transports.File({
          filename: config.winston.fileLogPath,
          level: config.winston.fileLogLevel,
        })
      );
    }

    if (
      config.winston.transports?.some(
        (transportType) => transportType === "console"
      ) &&
      typeof config.winston.consoleLogLevel === "string"
    ) {
      transportsOptions.push(
        new transports.Console({
          level: config.winston.consoleLogLevel,
        })
      );
    }

    if (
      config.winston.transports?.some(
        (transportType) => transportType === "database"
      ) &&
      typeof config.winston.databaseLogLevel === "string"
    ) {
      transportsOptions.push(
        new WinstonMariaDBTransport({
          databasePool: this.getDatabase().pool,
          databaseName: this.getConfig().database,
          level: "debug",
          tableName: "logs",
        })
      );
    }

    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: transportsOptions,
    });

    return this.logger;
  }

  public async getTableRepository() {
    if (this.tableRepository) {
      return this.tableRepository;
    }

    this.tableRepository = new TableRepository(
      this.getDatabase(),
      this.getConfig(),
      this.getLogger()
    );

    await this.tableRepository.setup();

    return this.tableRepository;
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

  public async getJBBR() {
    if (this.jbbr) {
      return this.jbbr;
    }

    const tableRepo = await this.getTableRepository();
    this.jbbr = new JohnnysBurgerBarRestaurant(
      tableRepo,
      this.getConfig(),
      this.getLogger()
    );

    return this.jbbr;
  }

  public async getJBBRController() {
    if (this.jbbrController) {
      return this.jbbrController;
    }

    const tableRepo = await this.getTableRepository();

    this.jbbrController = new JohnnysBurgerBarRestaurantController(
      tableRepo,
      this.getConfig(),
      this.getLogger()
    );

    return this.jbbrController;
  }

  public async getQRCodeController() {
    if (this.qrCodeController) {
      return this.qrCodeController;
    }

    const tableRepo = await this.getTableRepository();

    this.qrCodeController = new QRCodeController(tableRepo, this.getLogger());

    return this.qrCodeController;
  }

  public async getRoutes() {
    if (this.routes) {
      return this.routes;
    }

    const JBBRController = await this.getJBBRController();
    const QRController = await this.getQRCodeController();

    this.routes = new Routes(
      this.getRestifyServer(),
      this.getRoutesConfig(),
      JBBRController,
      QRController
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
    this.server = new Server(
      this.getRestifyServer(),
      this.getConfig(),
      this.getLogger()
    );

    return this.server;
  }
}
