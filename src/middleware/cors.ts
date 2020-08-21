import * as restify from "restify";
import { Config } from "../config/config";
import corsMiddleware = require("restify-cors-middleware");

export class Cors {
  constructor(private server: restify.Server, private config: Config) {
    const options: corsMiddleware.Options = {
      preflightMaxAge: 5,
      origins: this.config.origins,
      allowHeaders: ["Authorization"],
      exposeHeaders: ["Authorization"],
    };
    const cors = corsMiddleware(options);

    this.server.pre(cors.preflight);
    this.server.use(cors.actual);
  }
}
