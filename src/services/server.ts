import * as restify from "restify";
import { Config } from "../config/config";
import { Logger } from "../utils/logger";

export class Server {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger
  ) {
    //
  }

  public start(cb = () => undefined) {
    this.server.listen(this.config.port, this.config.restifyHost, () => {
      this.logger.info(`${this.server.name} listening at ${this.server.url}`);
      cb();
    });
  }

  public stop(cb = () => undefined) {
    this.server.close(() => {
      this.logger.info(
        `${this.server.name} closed and stopped listening at ${this.server.url}`
      );
      cb();
    });
  }
}
