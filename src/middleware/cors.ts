import * as restify from "restify";
import { Config } from "../config/config";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

// CORS middleware class which managers CORS for restify.
export class Cors {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger,
    private strings: Strings
  ) {
    // Register this middleware to run before routing occurs.
    this.server.pre((req, res, next) => {
      // Find matching origin in allowed origins from config.
      const origin = this.config.origins.find(
        (origin) => origin === req.headers["origin"]
      );

      // If no origin match was made, DON'T send headers.
      if (!origin) {
        // Log a warning that incoming origin header was unmatched with
        // those in the config.
        this.logger.warn(
          this.strings.corsUnmatchedOrigin
            .replace(":incomingHeader:", req.headers["origin"]!)
            .replace(":configOrigins:", JSON.stringify(this.config.origins))
        );

        return next();
      }

      // Log an "info" message to the logs stating that the incoming origin
      // header matched those in the config.
      this.logger.info(this.strings.corsMatchedOrigin);

      // If origin is matched, respond with required headers.
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Headers", "Authorization");

      // If the request method was OPTIONS respond with http code 200.
      if (req.method === "OPTIONS") {
        res.send(200);
      }

      // Go on to the next response handler.
      return next();
    });
  }
}
