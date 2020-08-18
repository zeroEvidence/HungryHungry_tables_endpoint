import * as restify from "restify";
import { JohnnysBurgerBarRestaurantController } from "../controllers/johnnysBurgerBarRestaurant";
import { QRCodeController } from "../controllers/qrCode";
import { RoutesConfig } from "./routesConfig";

export class Routes {
  constructor(
    private server: restify.Server,
    private routesConfig: RoutesConfig,
    private JBBRController: JohnnysBurgerBarRestaurantController,
    private QRCodeController: QRCodeController
  ) {
    this.server.get(
      this.routesConfig.routes.tables.johnnysBurgerBar,
      this.JBBRController.tables.bind(this.JBBRController)
    );

    this.server.get(
      this.routesConfig.routes.tables.qrCode,
      this.QRCodeController.qrCode.bind(this.QRCodeController)
    );
  }
}
