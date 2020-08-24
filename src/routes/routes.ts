import * as restify from "restify";
import { JohnnysBurgerBarRestaurantController } from "../controllers/johnnysBurgerBarRestaurantController";
import { RoutesConfig } from "./routesConfig";

// The Routes class which sets up the route with its controller.
export class Routes {
  constructor(
    private server: restify.Server,
    private routesConfig: RoutesConfig,
    private jbbrController: JohnnysBurgerBarRestaurantController
  ) {
    this.server.get(
      this.routesConfig.routes.tables.johnnysBurgerBar,
      this.jbbrController.tables.bind(this.jbbrController)
    );

    this.server.get(
      this.routesConfig.routes.tables.qrCode,
      this.jbbrController.qrCode.bind(this.jbbrController)
    );
  }
}
