import * as restify from "restify";
import { Config } from "../config/config";

// CORS middleware class which managers CORS for restify.
export class Cors {
  constructor(private server: restify.Server, private config: Config) {
    // Register this middleware to run before routing occurs.
    this.server.pre((req, res, next) => {
      // Find matching origin in allowed origins from config.
      const origin = this.config.origins.find(
        (origin) => origin === req.headers["origin"]
      );

      // If no origin match was made, DON'T proceed with next response handler.
      if (!origin) {
        return next(false);
      }

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
