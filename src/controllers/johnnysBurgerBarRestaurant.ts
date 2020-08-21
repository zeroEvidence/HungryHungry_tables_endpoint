import * as restify from "restify";
import { Config } from "../config/config";
import { TableRepository } from "../repository/tableRepository";
import { JohnnysBurgerBarRestaurant } from "../restaurants/johnnysBurgerBarRestaurant";

export class JohnnysBurgerBarRestaurantController {
  constructor(private tableRepo: TableRepository, private config: Config) {
    //
  }

  public async tables(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    res.contentType = "application/json";
    try {
      const JBBR = new JohnnysBurgerBarRestaurant(this.tableRepo, this.config);
      const availableTables = await JBBR.availableTables;

      res.send({ code: 200, message: availableTables });
    } catch (error) {
      console.error(error);
      res.send({ code: 503, message: "Service Unavailable" });
    }

    return next();
  }
}
