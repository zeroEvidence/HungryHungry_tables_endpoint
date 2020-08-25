import { readFileSync } from "fs";
import * as restify from "restify";
import { Config } from "../config/config";
import { Instance } from "../config/instance";
import { ILoggerEnvironmentOptions } from "../config/interfaces/loggerEnvironmentOptions.interface";
import { Strings } from "../config/strings";
import { JohnnysBurgerBarRestaurantController } from "../controllers/johnnysBurgerBarRestaurantController";
import { Database } from "../database/database";
import { Auth } from "../middleware/auth";
import { Cors } from "../middleware/cors";
import { RequestLogger } from "../middleware/requestLogger";
import { TableRepository } from "../repository/tableRepository";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";
import { Routes } from "../routes/routes";
import { RoutesConfig } from "../routes/routesConfig";
import { Server } from "../services/server";
import { IMariaDBTransportOptions } from "../utils/interfaces/mariaDBTransportOptions.interface";
import { Logger } from "../utils/logger";

// The Services class sets up the services which this software uses and creates
// all the objects needed by the service and by other objects.
export class Services {
  private config: Config | undefined;
  private instance: Instance | undefined;
  private strings: Strings | undefined;
  private server: Server | undefined;
  private auth: Auth | undefined;
  private cors: Cors | undefined;
  private restifyServer: restify.Server | undefined;
  private routes: Routes | undefined;
  private jbbrController: JohnnysBurgerBarRestaurantController | undefined;
  private routesConfig: RoutesConfig | undefined;
  private database: Database | undefined;
  private tableRepository: TableRepository | undefined;
  private jbbr: JohnnysBurgerBarRestaurant | undefined;
  private logger: Logger | undefined;
  private reqLogger: RequestLogger | undefined;

  // Constructor takes a config object to overwrite the default config.
  constructor(
    config: Config = new Config(),
    tableRepository?: TableRepository | undefined,
    logger?: Logger | undefined,
    database?: Database | undefined
  ) {
    this.config = config;

    // Used for testing, mocking the TableRepository.
    if (tableRepository) {
      this.tableRepository = tableRepository;
    }

    // Used for testing, mocking the Logger.
    if (logger) {
      this.logger = logger;
    }

    // Used for testing, mocking the Database.
    if (database) {
      this.database = database;
    }
  }

  // Boot initiates any connections required before the creation of services
  // and other objects, e.g. database. It also initialises cron tasks.
  public async boot() {
    await this.getDatabase().start();

    // This will fetch the tables from the HungryHungry endpoint
    // and save them to the database along with their QRCodes data.
    const jbbr = await this.getJBBR();
    const oneHour = 1000 * 60 * 60;

    // This will fetch the tables from the endpoint above every hour and save
    // them into the database.
    setInterval(() => {
      jbbr.tables = jbbr.fetchTables();
    }, oneHour);
  }

  // Gives back the Config object.
  public getConfig() {
    // Return the Config object if it is already created.
    if (this.config) {
      return this.config;
    }

    // Creates a new Config object.
    this.config = new Config();

    // And returns it.
    return this.config;
  }

  // Gives back the Strings object.
  public getStrings() {
    // Returns the Strings object if it's already created.
    if (this.strings) {
      return this.strings;
    }

    // Creates a new Strings object.
    this.strings = new Strings();

    // And returns it.
    return this.strings;
  }

  // Gives back the Instance object.
  public getInstance() {
    // Returns the Instance object if it's already created.
    if (this.instance) {
      return this.instance;
    }

    // Creates a new Instance object.
    this.instance = new Instance();

    // And returns it.
    return this.instance;
  }

  // Gives back the Database object.
  public getDatabase() {
    // Returns the Database object if it's already created.
    if (this.database) {
      return this.database;
    }

    // Creates a new Database object.
    this.database = new Database(this.getConfig(), this.getStrings());

    // And returns it.
    return this.database;
  }

  // Gives back the Logger object.
  public getLogger() {
    // Returns the Logger object if it's already created.
    if (this.logger) {
      return this.logger;
    }

    // Get the Config object.
    const config = this.getConfig();
    // Create the Logger options.
    const loggerOptions: ILoggerEnvironmentOptions &
      IMariaDBTransportOptions = {
      databasePool: this.getDatabase().pool,
      databaseName: config.database,
      ...config.logger,
    };

    // Creates a new Logger object.
    this.logger = new Logger(loggerOptions);

    // And returns it.
    return this.logger;
  }

  // Gives back the TableRepository.
  public async getTableRepository() {
    // Returns the TableRepository object if it's already created.
    if (this.tableRepository) {
      return this.tableRepository;
    }

    // Creates a new TableRepository object.
    this.tableRepository = new TableRepository(
      this.getDatabase(),
      this.getConfig(),
      this.getLogger()
    );

    // Run the setup method to create the required database and tables.
    await this.tableRepository.setup();

    // And return it.
    return this.tableRepository;
  }

  // Gives back the RequestLogger middleware object.
  public getReqLogger() {
    // Returns the RequestLogger object if it's already created.
    if (this.reqLogger) {
      return this.reqLogger;
    }

    // Creates a new RequestLogger object.
    this.reqLogger = new RequestLogger(
      this.getRestifyServer(),
      this.getLogger(),
      this.getStrings()
    );

    // And return it.
    return this.reqLogger;
  }

  // Gives back the Authentication middleware object.
  public getAuth() {
    // Returns the Auth object if it's already created.
    if (this.auth) {
      return this.auth;
    }

    // Creates a new Auth object.
    this.auth = new Auth(
      this.getRestifyServer(),
      this.getConfig(),
      this.getLogger(),
      this.getStrings()
    );

    // And returns it.
    return this.auth;
  }

  // Gives back the CORS middleware object.
  public getCors() {
    // Returns the CORS middleware object if it's already been created.
    if (this.cors) {
      return this.cors;
    }

    // Creates a new CORS object.
    this.cors = new Cors(
      this.getRestifyServer(),
      this.getConfig(),
      this.getLogger(),
      this.getStrings()
    );

    // And returns it.
    return this.cors;
  }

  // Gives back the restify Server object.
  public getRestifyServer() {
    // Returns the restify Server object if it's already been created.
    if (this.restifyServer) {
      return this.restifyServer;
    }

    // Initialise options object.
    const options: restify.ServerOptions = {};
    // Get the Config object.
    const config: Config = this.getConfig();

    // If the SSL cert and key have been given add the file output to options.
    if (
      typeof config.keyURI === "string" &&
      typeof config.certURI === "string"
    ) {
      // Read the key URI into the options object.
      options.key = readFileSync(config.keyURI, "utf8");
      // Read the cert URI into the options object.
      options.certificate = readFileSync(config.certURI, "utf8");
    }

    // Creates a new restify Server object.
    this.restifyServer = restify.createServer(options);

    // And returns it.
    return this.restifyServer;
  }

  // Gives back the RoutesConfig object.
  public getRoutesConfig() {
    // Returns the RoutesConfig object if it's already been created.
    if (this.routesConfig) {
      return this.routesConfig;
    }

    // Creates a new RoutesConfig object.
    this.routesConfig = new RoutesConfig();

    // And returns it.
    return this.routesConfig;
  }

  // Gives back the JohnnysBurgerBarRestaurant object.
  public async getJBBR() {
    // Returns the JohnnysBurgerBarRestaurant object if it's already created.
    if (this.jbbr) {
      return this.jbbr;
    }

    // Get the TableRepository.
    const tableRepo = await this.getTableRepository();

    // Create a new JohnnysBurgerBarRestaurant object.
    this.jbbr = new JohnnysBurgerBarRestaurant(
      tableRepo,
      this.getConfig(),
      this.getLogger(),
      this.getInstance(),
      this.getStrings()
    );

    // And return it.
    return this.jbbr;
  }

  // Gives back the JohnnysBurgerBarRestaurantController object.
  public async getJBBRController() {
    // Return the JohnnysBurgerBarRestaurantController object if it's already
    // been created.
    if (this.jbbrController) {
      return this.jbbrController;
    }

    // Get the JohnnysBurgerBarRestaurant object.
    const jbbr = await this.getJBBR();

    // Create a new JohnnysBurgerBarRestaurantController object.
    this.jbbrController = new JohnnysBurgerBarRestaurantController(
      jbbr,
      this.getLogger(),
      this.getStrings()
    );

    // And return it.
    return this.jbbrController;
  }

  // Gives back the Routes object.
  public async getRoutes() {
    // Return the Routes object if it's already been created.
    if (this.routes) {
      return this.routes;
    }

    // Get the JohnnysBurgerBarRestaurantController object.
    const JBBRController = await this.getJBBRController();

    // Create a new Routes object.
    this.routes = new Routes(
      this.getRestifyServer(),
      this.getRoutesConfig(),
      JBBRController
    );

    // And return it.
    return this.routes;
  }

  // Gives back the Server object.
  public getServer() {
    // Return the Server object if it's already been created.
    if (this.server) {
      return this.server;
    }

    // Load the RequestLogger middleware.
    this.getReqLogger();
    // Load the Authentication middleware.
    this.getAuth();
    // Load the CORS middleware.
    this.getCors();
    // Load the Routes.
    this.getRoutes();

    // Create a new Server object.
    this.server = new Server(
      this.getRestifyServer(),
      this.getConfig(),
      this.getLogger(),
      this.getStrings()
    );

    // And return it.
    return this.server;
  }
}
