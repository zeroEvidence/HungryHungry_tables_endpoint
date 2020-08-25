import { createPool, Pool, PoolConfig } from "mariadb";
import { Config } from "../config/config";
import { Strings } from "../config/strings";

// Database class that managers the connection to the database.
export class Database {
  private _pool: Pool;
  private poolConfig: PoolConfig;

  constructor(private config: Config = new Config(), private strings: Strings) {
    // Create the Pool config, used to connect to the database.
    this.poolConfig = {
      rowsAsArray: false,
      timezone: "Z",
      namedPlaceholders: true,
      ...this.config.mariaDB,
    };

    // Create the pool.
    this._pool = createPool(this.poolConfig);
  }

  // Ensures that the pool had been created and Test the connection.
  public start(done = () => undefined) {
    return (
      this._pool
        .getConnection()
        .then(() => {
          // If successfully connected, log the connection information to console.
          // tslint:disable-next-line
          console.log(
            this.strings.connectedToDatabase.replace(
              ":host:",
              this.config.mariaDB.host!
            )
          );
        })
        .catch((err) => {
          // If there is a connection error, log it to console.
          // tslint:disable-next-line
          console.error(err);
        })
        // call the callback regardless of outcome.
        .finally(done)
    );
  }

  // Closes the pool
  public stop(done = () => undefined) {
    return (
      this._pool
        .end()
        .then(() => {
          // If successfully closed, log a message to the console.
          // tslint:disable-next-line
          console.log(this.strings.connectedToDatabaseEnded);
        })
        .catch((error) => {
          // If the connection had an error while closing, log it to console.
          // tslint:disable-next-line
          console.error(error);
        })
        // Call the callback regardless of outcome.
        .finally(done)
    );
  }

  // Get the pool
  public get pool() {
    return this._pool;
  }
}
