import * as restify from "restify";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

export class RequestLogger {
  constructor(
    private server: restify.Server,
    private logger: Logger,
    private strings: Strings
  ) {
    this.server.pre(
      (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.logger.info(
          this.strings.incomingRequest.replace(
            ":requestData:",
            JSON.stringify({
              url: req.url,
              params: req.params,
              ip: req.connection.remoteAddress,
            })
          )
        );

        next();
      }
    );
  }
}
