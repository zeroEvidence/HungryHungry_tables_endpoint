import * as restify from "restify";
import { Config } from "../config/config";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

export class Server {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger,
    private strings: Strings
  ) {
    //
  }

  public start(cb = () => undefined) {
    this.server.listen(this.config.port, this.config.restifyHost, () => {
      this.logger.info(
        this.strings.restifyListeningAt
          .replace(":name:", this.server.name)
          .replace(":url:", this.server.url)
      );
      cb();
    });
  }

  public stop(cb = () => undefined) {
    this.server.close(() => {
      this.logger.info(
        this.strings.restifyClosed
          .replace(":name:", this.server.name)
          .replace(":url:", this.server.url)
      );
      cb();
    });
  }
}
