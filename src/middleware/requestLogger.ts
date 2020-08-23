import * as restify from "restify";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

// RequestLogger class is for the construction of a restify middleware which
// logs incoming requests and their details.
export class RequestLogger {
  constructor(
    private server: restify.Server,
    private logger: Logger,
    private strings: Strings
  ) {
    // Register the request to handle the request prior to routing.
    this.server.pre(
      (req: restify.Request, res: restify.Response, next: restify.Next) => {
        // Log the incoming request with request URL, the URL parameters,
        // and IP.
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

        // Proceed to the next response handler.
        return next();
      }
    );
  }
}
