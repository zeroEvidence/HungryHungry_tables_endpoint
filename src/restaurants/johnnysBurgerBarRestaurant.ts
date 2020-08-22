import fetch from "node-fetch";
import { Config } from "../config/config";
import { Instance } from "../config/instance";
import { Strings } from "../config/strings";
import { ITables } from "../interfaces/tables.interface";
import { TableRepository } from "../repository/tableRepository";
import { Logger } from "../utils/logger";
import { Restaurant } from "./restaurant";

export class JohnnysBurgerBarRestaurant extends Restaurant {
  constructor(
    tableRepo: TableRepository,
    config: Config,
    logger: Logger,
    instance: Instance,
    strings: Strings
  ) {
    super(tableRepo, config, logger, instance, strings);

    this.tables = this.fetchTables();
  }

  public fetchTables(): Promise<ITables> {
    return new Promise((resolve, reject) => {
      fetch(this.instance.hungryhungryJBBRUri)
        .then((res) => res.json())
        .then((tables) => resolve(tables))
        .catch((err) => {
          this.logger.error(err);
        })
        .finally(() => {
          this.logger.warn(this.strings.usingCachedTables);

          // Had to add this because as at 20:29 18/8/20 the uri above
          // had an error / didn't exist.
          resolve({
            Front: {
              name: "Front",
              tables: {
                "75": { name: "1", visible: 1 },
                "108": { name: "2", visible: 1 },
                "102": { name: "3", visible: 1 },
                "73": { name: "4", visible: 1 },
                "79": { name: "5", visible: 1 },
                "80": { name: "6", visible: 1 },
                "109": { name: "7", visible: 1 },
                "105": { name: "7", visible: 1 },
                "110": { name: "8", visible: 1 },
                "111": { name: "9", visible: 1 },
                "112": { name: "10", visible: 1 },
                "113": { name: "11", visible: 1 },
                "115": { name: "12", visible: 1 },
                "116": { name: "13", visible: 1 },
                "63": { name: "101", visible: 1 },
                "64": { name: "102", visible: 1 },
                "65": { name: "103", visible: 1 },
                "66": { name: "104", visible: 1 },
                "90": { name: "201", visible: 1 },
                "91": { name: "202", visible: 1 },
                "92": { name: "203", visible: 1 },
                "93": { name: "204", visible: 1 },
                "86": { name: "205", visible: 1 },
                "87": { name: "206", visible: 1 },
                "88": { name: "207", visible: 1 },
                "107": { name: "501", visible: 1 },
                "83": { name: "Invalid table name", visible: 0 },
                "77": { name: "Invalid table name", visible: 0 },
                "82": { name: "Invalid table name", visible: 0 },
                "84": { name: "Invalid table name", visible: 0 },
                "106": { name: "Invalid table name", visible: 0 },
                "62": { name: "Invalid table name", visible: 0 },
                "85": { name: "Invalid table name", visible: 0 },
                "117": { name: "Space", visible: 0 },
              },
              active_tables: 26,
              is_legacy: "false",
            },
            Back: {
              name: "Back",
              tables: {
                "95": { name: "11", visible: 1 },
                "94": { name: "12", visible: 1 },
                "97": { name: "21", visible: 1 },
                "96": { name: "22", visible: 1 },
                "99": { name: "31", visible: 1 },
                "98": { name: "32", visible: 1 },
                "101": { name: "41", visible: 1 },
                "100": { name: "42", visible: 1 },
                "42": { name: "51", visible: 1 },
                "43": { name: "52", visible: 1 },
                "44": { name: "53", visible: 1 },
                "45": { name: "54", visible: 1 },
                "46": { name: "55", visible: 1 },
                "51": { name: "61", visible: 1 },
                "52": { name: "62", visible: 1 },
                "53": { name: "63", visible: 1 },
                "54": { name: "64", visible: 1 },
                "55": { name: "65", visible: 1 },
                "35": { name: "301", visible: 1 },
                "36": { name: "302", visible: 1 },
                "37": { name: "303", visible: 1 },
                "38": { name: "304", visible: 1 },
                "39": { name: "305", visible: 1 },
                "104": { name: "306", visible: 1 },
                "60": { name: "307", visible: 1 },
                "40": { name: "Invalid table name", visible: 0 },
                "58": { name: "Invalid table name", visible: 0 },
                "57": { name: "Invalid table name", visible: 0 },
                "41": { name: "Invalid table name", visible: 0 },
                "59": { name: "Invalid table name", visible: 0 },
              },
              active_tables: 25,
              is_legacy: "false",
            },
            A: {
              name: "A",
              tables: { "118": { name: "1", visible: 0 } },
              active_tables: 0,
              is_legacy: "false",
            },
          });
        });
    });
  }
}
