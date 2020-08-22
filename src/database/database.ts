import { createPool, Pool, PoolConfig } from "mariadb";
import { Config } from "../config/config";
import { Strings } from "../config/strings";

export class Database {
  private _pool: Pool;
  private poolConfig: PoolConfig;

  constructor(private config: Config = new Config(), private strings: Strings) {
    this.poolConfig = {
      rowsAsArray: false,
      timezone: "Z",
      namedPlaceholders: true,
      ...this.config.mariaDB,
    };

    this._pool = createPool(this.poolConfig);
  }

  public start(done = () => undefined) {
    this._pool
      .getConnection()
      .then(() => {
        // tslint:disable-next-line
        console.log(
          this.strings.connectedToDatabase.replace(
            ":host:",
            this.config.mariaDB.host!
          )
        );
      })
      .catch((err) => {
        // tslint:disable-next-line
        console.error(err);
      })
      .finally(done);
  }

  public stop(done = () => undefined) {
    return this._pool
      .end()
      .then(() => {
        // tslint:disable-next-line
        console.log(this.strings.connectedToDatabaseEnded);
      })
      .finally(done);
  }

  public get pool() {
    return this._pool;
  }
}
