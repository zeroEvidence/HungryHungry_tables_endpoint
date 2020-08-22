import * as restify from "restify";
import { Config } from "../config/config";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

export class Auth {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger,
    private strings: Strings
  ) {
    this.server.use(restify.plugins.authorizationParser());
    this.server.use(this.authorisation.bind(this));
  }

  public authorisation(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    const authUsername = req.authorization?.basic?.username;
    const authPassword = req.authorization?.basic?.password || "";

    this.logger.info(
      this.strings.authIncomingUsernamePassword
        .replace(":authUsername:", authUsername!)
        .replace(":authPassword:", authPassword)
    );

    if (
      authUsername !== this.config.authUsername ||
      authPassword !== this.config.authPassword
    ) {
      res.contentType = "application/json";

      this.logger.warn(
        this.strings.unauthorizedAttempt.replace(
          ":ip:",
          req.connection.remoteAddress!
        )
      );

      res.send({ code: 401, message: this.strings.unauthorized });

      return next(false);
    } else {
      this.logger.info(
        this.strings.authorizedAccess.replace(
          ":ip:",
          req.connection.remoteAddress!
        )
      );

      return next();
    }
  }
}
