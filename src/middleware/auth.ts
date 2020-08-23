import * as restify from "restify";
import { Config } from "../config/config";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

// Authentication middleware class which managers basic authentication for
// restify.
export class Auth {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger,
    private strings: Strings
  ) {
    // Register the inbuilt authorization parser middleware for converting the
    // base64 authorization header value to their corresponding username and
    // password.
    this.server.use(restify.plugins.authorizationParser());
    // Register the authorisation method as middleware.
    this.server.use(this.authorisation.bind(this));
  }

  public authorisation(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    // Get the incoming username and password.
    const authUsername = req.authorization?.basic?.username;
    const authPassword = req.authorization?.basic?.password || "";

    // Log the incoming username and password.
    this.logger.info(
      this.strings.authIncomingUsernamePassword
        .replace(":authUsername:", authUsername!)
        .replace(":authPassword:", authPassword)
    );

    // If the incoming username and password is NOT the same as the server's
    // username and password then deny access.
    if (
      authUsername !== this.config.authUsername ||
      authPassword !== this.config.authPassword
    ) {
      // Response content is JSON.
      res.contentType = "application/json";

      // Log the attempted access details.
      this.logger.warn(
        this.strings.unauthorizedAttempt.replace(
          ":ip:",
          req.connection.remoteAddress!
        )
      );

      // Send an "unauthorized" response message.
      res.send({ code: 401, message: this.strings.unauthorized });

      // Stop processing the request.
      return next(false);
    } else {
      // Log the successful authorization.
      this.logger.info(
        this.strings.authorizedAccess.replace(
          ":ip:",
          req.connection.remoteAddress!
        )
      );

      // Proceed to the next response handler.
      return next();
    }
  }
}
