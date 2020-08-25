import { Promise } from "bluebird";
import { ILoggerEnvironmentOptions } from "../../src/config/interfaces/loggerEnvironmentOptions.interface";
import { IMariaDBTransportOptions } from "../../src/utils/interfaces/mariaDBTransportOptions.interface";
import { Logger } from "../../src/utils/logger";

export class MockLogger extends Logger {
  constructor(options: ILoggerEnvironmentOptions & IMariaDBTransportOptions) {
    super(options);
  }

  protected async logToDatabase(
    message: string,
    level: string,
    timestamp = new Date()
  ) {
    await Promise.resolve();
  }

  protected async initTable() {
    await Promise.resolve();
  }
}
