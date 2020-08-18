import * as restify from "restify";
import { Config } from "../config/config";

export class Server {
  constructor(private server: restify.Server, private config: Config) {
    //
  }

  public start(cb = () => undefined) {
    this.server.listen(this.config.port, this.config.dockerHost, () => {
      console.log('%s listening at %s', this.server.name, this.server.url);
      cb();
    });
  }

  public stop(cb = () => undefined) {
    this.server.close(cb);
  }
}
