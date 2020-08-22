import { createPool, Pool, PoolConfig, PoolConnection } from "mariadb";
import { Config } from "../config/config";

export class Database {
  private _pool: Pool;
  private _connection: Promise<PoolConnection>;

  constructor(private config: Config = new Config()) {
    const poolConfig: PoolConfig = {
      rowsAsArray: false,
      timezone: "Z",
      namedPlaceholders: true,
      ...this.config.mariaDB,
    };

    this._pool = createPool(poolConfig);
    this._connection = this._pool.getConnection();
  }

  public start(done = () => undefined) {
    this._connection
      .then((connection) => {
        // tslint:disable-next-line
        console.log(
          `Connected to database. Connection id is: ${connection.threadId}.`
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
        console.log("Connection to the database as ended gracefully.");
      })
      .finally(done);
  }

  public get pool() {
    return this._pool;
  }

  public get connection() {
    return this._connection;
  }
}
