import * as restify from "restify";
import { Strings } from "../config/strings";
import { IQRCode } from "../interfaces/qrCode.interface";
import { TableRepository } from "../repository/tableRepository";
import { Logger } from "../utils/logger";

// QR Code controller class for the restify service.
export class QRCodeController {
  constructor(
    private tableRepo: TableRepository,
    private logger: Logger,
    private strings: Strings
  ) {
    //
  }

  public async qrCode(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    // Set the content type to JSON.
    res.contentType = "application/json";

    try {
      // Get the QR Code data.
      const qrData: IQRCode = await this.tableRepo.getQRData(
        req.params.tableid
      );

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
