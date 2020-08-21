import * as restify from "restify";
import { Logger } from "winston";
import { IQRCode } from "../interfaces/qrCode.interface";
import { TableRepository } from "../repository/tableRepository";

export class QRCodeController {
  constructor(private tableRepo: TableRepository, private logger: Logger) {
    //
  }

  public async qrCode(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    res.contentType = "application/json";

    try {
      const qrData: IQRCode = await this.tableRepo.getQRData(
        req.params.tableid
      );

      res.send({ code: 200, message: qrData.QRCodeData });
    } catch (error) {
      this.logger.error(error);

      res.send({ code: 503, message: "Service Unavailable" });
    }

    return next();
  }
}
