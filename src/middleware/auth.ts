import * as restify from "restify";
import { Config } from "../config/config";
import { Logger } from "../utils/logger";

export class Auth {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger
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
      `Incoming username: ${authUsername}, password: ${authPassword}`
    );

    if (
      authUsername !== this.config.authUsername ||
      authPassword !== this.config.authPassword
    ) {
      res.contentType = "application/json";

      this.logger.warn(
        `Unauthorized attempt from ip: ${req.connection.remoteAddress}`
      );

      res.send({ code: 401, message: "Unauthorized" });

      return next(false);
    } else {
      this.logger.info(
        `Authorized access from ip: ${req.connection.remoteAddress}`
      );

      return next();
    }
  }
}
