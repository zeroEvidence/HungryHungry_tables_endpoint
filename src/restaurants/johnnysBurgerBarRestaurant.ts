import fetch from "node-fetch";
import { Config } from "../config/config";
import { Database } from "../database/database";
import { ITables } from "../interfaces/tables.interface";
import { Restaurant } from "./restaurant";

export class JohnnysBurgerBarRestaurant extends Restaurant {
  constructor(
    db: Database,
    config: Config,
    private tablesURI = "https://hungryhungry.com/helping-hospo/hh_test_tabledata.json"
  ) {
    super(db, config);

    this.tables = this.fetchTables();
  }

  private fetchTables(): Promise<ITables> {
    return fetch(this.tablesURI).then((res) => res.json());
  }
}
