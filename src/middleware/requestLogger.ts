import * as restify from "restify";
import { Logger } from "../utils/logger";

export class RequestLogger {
  constructor(private server: restify.Server, private logger: Logger) {
    this.server.pre(
      (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.logger.info(
          "Incoming request: " +
            JSON.stringify({
              url: req.url,
              params: req.params,
              ip: req.connection.remoteAddress,
            })
        );

        next();
      }
    );
  }
}
