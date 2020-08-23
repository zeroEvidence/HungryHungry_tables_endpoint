import * as restify from "restify";
import { Config } from "../config/config";
import corsMiddleware = require("restify-cors-middleware");

// CORS middleware class which managers CORS for restify.
export class Cors {
  constructor(private server: restify.Server, private config: Config) {
    // Config for CORS using basic authentication.
    const options: corsMiddleware.Options = {
      preflightMaxAge: 5,
      origins: this.config.origins,
      allowHeaders: ["Authorization"],
      exposeHeaders: ["Authorization"],
    };
    // Get the CORS middleware handlers
    const cors = corsMiddleware(options);

    // Use cors.preflight to handle CORS prior to routing.
    this.server.pre(cors.preflight);
    // Use cors.actual to handle CORS post routing.
    this.server.use(cors.actual);
  }
}
