import * as restify from "restify";
import { Strings } from "../config/strings";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";
import { Logger } from "../utils/logger";

export class JohnnysBurgerBarRestaurantController {
  constructor(
    private jbbr: JohnnysBurgerBarRestaurant,
    private logger: Logger,
    private strings: Strings
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
      const availableTables = await this.jbbr.availableTables;

      this.logger.info(this.strings.respondingWithAvailableTables);

      res.send({ code: 200, message: availableTables });
    } catch (error) {
      this.logger.error(error);

      res.send({ code: 503, message: this.strings.serviceUnavailable });
    }

    return next();
  }
}
