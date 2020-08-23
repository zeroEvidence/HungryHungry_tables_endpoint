import * as restify from "restify";
import { Strings } from "../config/strings";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";
import { Logger } from "../utils/logger";

// Johnny's Burger Bar Restaurant controller class for the restify service.
export class JohnnysBurgerBarRestaurantController {
  constructor(
    private jbbr: JohnnysBurgerBarRestaurant,
    private logger: Logger,
    private strings: Strings
  ) {
    //
  }

  // The method responsible for handling a request to "/tables/johnnysBurgerBar"
  // Sends back the available tables or an error.
  public async tables(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    res.contentType = "application/json";
    try {
      // get the available tables from JBBR.
      const availableTables = await this.jbbr.availableTables;

      // logging action.
      this.logger.info(this.strings.respondingWithAvailableTables);

      // send the message.
      res.send({ code: 200, message: availableTables });
    } catch (error) {
      // log the error when one occurs.
      this.logger.error(error);

      // send an error message.
      res.send({ code: 503, message: this.strings.serviceUnavailable });
    }

    // continue on to the next handler (if any).
    return next();
  }
}
