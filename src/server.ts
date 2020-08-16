import { readFileSync } from "fs";
import * as restify from "restify";
import { Config } from "./config";
import { JohnnysBurgerBarRestaurant } from "./restaurants/johnnysBurgerBarRestaurant";

export class Server {
  private server: restify.Server;

  constructor(private config: Config = new Config()) {
    const options: restify.ServerOptions = {};

    if (
      typeof this.config.keyURI === "string" &&
      typeof this.config.certURI === "string"
    ) {
      options.key = readFileSync(this.config.keyURI, "utf8");
      options.certificate = readFileSync(this.config.certURI, "utf8");
    }

    this.server = restify.createServer(options);
    this.server.use(restify.plugins.authorizationParser());
  }

  public start(cb = () => undefined) {
    this.server.get(
      "/tables/johnnysBurgerBar",
      async (
        req: restify.Request,
        res: restify.Response,
        next: restify.Next
      ) => {
        const authUsername = req.authorization?.basic?.username;
        const authPassword = req.authorization?.basic?.password || "";

        res.contentType = "application/json";
        if (
          authUsername !== this.config.authUsername ||
          authPassword !== this.config.authPassword
        ) {
          res.send({ code: 401, message: "Unauthorized" });
        } else {
          try {
            const johnnysBurgerBar = new JohnnysBurgerBarRestaurant();
            const availableTables = await johnnysBurgerBar.availableTables;

            res.send({ code: 200, message: availableTables });
          } catch (error) {
            res.send({ code: 503, message: "Service Unavailable" });
          }
        }

        return next();
      }
    );

    this.server.listen(this.config.port, this.config.host, () => {
      console.log("%s listening at %s", this.server.name, this.server.url);
      cb();
    });
  }

  public stop(cb = () => undefined) {
    this.server.close(cb);
  }
}
