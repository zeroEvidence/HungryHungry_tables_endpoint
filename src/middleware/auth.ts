import * as restify from "restify";
import { Config } from "../config/config";

export class Auth {
  constructor(private config: Config) {
    //
  }

  public authorisation(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    const authUsername = req.authorization?.basic?.username;
    const authPassword = req.authorization?.basic?.password || "";

    if (
      authUsername !== this.config.authUsername ||
      authPassword !== this.config.authPassword
    ) {
      res.contentType = "application/json";
      res.send({ code: 401, message: "Unauthorized" });

      return next(false);
    } else {
      return next();
    }
  }
}
