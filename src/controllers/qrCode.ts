import * as QRCode from "qrcode";
import * as restify from "restify";

export class QRCodeController {
  constructor(
    private baseUrl = "https://dev.hungryhungry.com/oceana2/menu?locationID=1995257&tableID="
  ) {
    //
  }

  public async qrCode(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    res.contentType = "application/json";

    try {
      const QR = await QRCode.toDataURL(`${this.baseUrl}${req.params.tableid}`);

      res.send({ code: 200, message: QR });
    } catch (error) {
      console.error(error);
      res.send({ code: 503, message: "Service Unavailable" });
    }

    return next();
  }
}
