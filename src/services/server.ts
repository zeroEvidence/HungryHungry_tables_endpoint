import * as restify from "restify";
import { Config } from "../config/config";
import { Strings } from "../config/strings";
import { Logger } from "../utils/logger";

// The Server class to manage the restify server instance.
export class Server {
  constructor(
    private server: restify.Server,
    private config: Config,
    private logger: Logger,
    private strings: Strings
  ) {
    //
  }

  // Starts the restify server based on the Config object variables.
  public start(cb = () => undefined) {
    // Start the server listening on configured hostname and port.
    this.server.listen(this.config.port, this.config.restifyHost, () => {
      // When the server starts, log the server details.
      this.logger.info(
        this.strings.restifyListeningAt
          .replace(":name:", this.server.name)
          .replace(":url:", this.server.url)
      );
      // Call the callback.
      cb();
    });
  }

  // Stops the restify server.
  public stop(cb = () => undefined) {
    // Stop the restify server.
    this.server.close(() => {
      // When the server stops, log the server details.
      this.logger.info(
        this.strings.restifyClosed
          .replace(":name:", this.server.name)
          .replace(":url:", this.server.url)
      );
      // Call the callback.
      cb();
    });
  }
}
