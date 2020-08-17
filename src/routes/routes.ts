import * as restify from "restify";
import { JohnnysBurgerBarRestaurantController } from "../controllers/johnnysBurgerBarRestaurant";
import { RoutesConfig } from "./routesConfig";

export class Routes {
  constructor(
    private server: restify.Server,
    private routesConfig: RoutesConfig,
    private JBBRController: JohnnysBurgerBarRestaurantController
  ) {
    this.server.get(
      this.routesConfig.routes.tables.johnnysBurgerBar,
      this.JBBRController.tables.bind(this.JBBRController)
    );
  }
}
