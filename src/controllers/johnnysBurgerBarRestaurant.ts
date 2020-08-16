import * as restify from "restify";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";

export class JohnnysBurgerBarRestaurantController {
  constructor() {
    //
  }

  public async tables(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    res.contentType = "application/json";
    try {
      const JBBR = new JohnnysBurgerBarRestaurant();
      const availableTables = await JBBR.availableTables;

      res.send({ code: 200, message: availableTables });
    } catch (error) {
      res.send({ code: 503, message: "Service Unavailable" });
    }

    return next();
  }
}
