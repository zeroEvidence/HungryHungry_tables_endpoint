import * as restify from "restify";
import { Config } from "../config/config";
import { TableRepository } from "../repository/tableRepository";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";
import { Logger } from "../utils/logger";

export class JohnnysBurgerBarRestaurantController {
  constructor(
    private tableRepo: TableRepository,
    private config: Config,
    private logger: Logger
  ) {
    //
  }

  public async tables(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    res.contentType = "application/json";
    try {
      const JBBR = new JohnnysBurgerBarRestaurant(
        this.tableRepo,
        this.config,
        this.logger
      );
      const availableTables = await JBBR.availableTables;

      this.logger.info("responding with available tables");

      res.send({ code: 200, message: availableTables });
    } catch (error) {
      this.logger.error(error);

      res.send({ code: 503, message: "Service Unavailable" });
    }

    return next();
  }
}
