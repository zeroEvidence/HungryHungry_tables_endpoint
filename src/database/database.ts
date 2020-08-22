import { createPool, Pool, PoolConfig } from "mariadb";
import { Config } from "../config/config";

export class Database {
  private _pool: Pool;
  private poolConfig: PoolConfig;

  constructor(private config: Config = new Config()) {
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
        console.log(`Connected to database at: ${this.config.mariaDB.host}.`);
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
        console.log("Connection to the database as ended gracefully.");
      })
      .finally(done);
  }

  public get pool() {
    return this._pool;
  }
}
