import * as restify from "restify";
import { Strings } from "../config/strings";
import { IQRCode } from "../interfaces/qrCode.interface";
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

  // The method responsible for handling a request to
  // "/tables/johnnysBurgerBar/qrimg/:tableid".
  // sends back the QRCode Data or an error.
  public async qrCode(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    // Set the content type to JSON.
    res.contentType = "application/json";

    try {
      // Get the QR Code data.
      const qrData: IQRCode = await this.jbbr.getQRData(req.params.tableid);

      // Log the response.
      this.logger.info(
        this.strings.respondingWithQRData.replace(
          ":tableid:",
          req.params.tableid
        )
      );

      // Send the response.
      res.send({ code: 200, message: qrData.QRCodeData });
    } catch (error) {
      // If there is an error log it.
      this.logger.error(error);

      // Send error back as the response.
      res.send({ code: 503, message: this.strings.serviceUnavailable });
    }

    // Continue to the next response handler, (if there is one).
    return next();
  }
}
