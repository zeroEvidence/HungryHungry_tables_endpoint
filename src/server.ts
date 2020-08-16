import * as restify from "restify";
import { Config } from "./config/config";
import { JohnnysBurgerBarRestaurant } from "./restaurants/johnnysBurgerBarRestaurant";

export class Server {
  constructor(private server: restify.Server, private config: Config) {
    //
  }

  public start(cb = () => undefined) {
    this.server.get(
      "/tables/johnnysBurgerBar",
      async (
        req: restify.Request,
        res: restify.Response,
        next: restify.Next
      ) => {
        res.contentType = "application/json";
        try {
          const johnnysBurgerBar = new JohnnysBurgerBarRestaurant();
          const availableTables = await johnnysBurgerBar.availableTables;

          res.send({ code: 200, message: availableTables });
        } catch (error) {
          console.log("error", error);
          res.send({ code: 503, message: "Service Unavailable" });
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
