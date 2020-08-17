import { Promise } from "bluebird";
import { connect, connection, Connection } from "mongoose";
import { Config } from "../config/config";
import { Table } from "../models/table";
import { IModels } from "./interfaces/models.interface";

export class Database {
  private db: Connection;
  private _models: IModels;

  constructor(private config: Config = new Config()) {
    this.db = connection;

    this._models = {
      Table: new Table().model,
    };
  }

  public start() {
    return new Promise((resolve, reject) => {
      this.db.on("error", (err) => {
        console.error(err);
        reject(err);
      });

      this.db.once("open", () => {
        console.log(`mongoose connected to ${this.config.mongoDBURI}`);
        resolve();
      });

      connect(this.config.mongoDBURI, { poolSize: 10, useNewUrlParser: true });
    });
  }

  public stop() {
    return this.db.close();
  }

  public get models() {
    return this._models;
  }
}
