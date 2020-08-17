import { Config } from "../../../src/config/config";
import { Database } from "../../../src/database/database";
import { IAvailableTables } from "../../../src/interfaces/availableTables.interface";
import { ITables } from "../../../src/interfaces/tables.interface";
import { Services } from "../../../src/modules/services";
import { JohnnysBurgerBarRestaurant } from "../../../src/restaurants/johnnysBurgerBarRestaurant";

describe("JohnnysBurgerBarRestaurant", () => {
  let JBBR: JohnnysBurgerBarRestaurant;
  let expectedAvailableTables: IAvailableTables;
  let tables: ITables;
  let db: Database;
  let config: Config;

  beforeAll(() => {
    const service = new Services();
    db = service.getDatabase();
    config = service.getConfig();
  });

  afterAll(() => {
    db.stop();
  });

  beforeEach((done) => {
    expectedAvailableTables = {
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
        },
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
        },
      },
    };

    tables = {
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
    };

    JBBR = new JohnnysBurgerBarRestaurant(db, config);

    JBBR.tables.then(() => {
      done();
    });
  });

  describe("availableTables", () => {
    test("Should get available tables", async () => {
      const receivedAvailableTables = await JBBR.availableTables;

      expect(receivedAvailableTables).toEqual(expectedAvailableTables);
    });
  });

  describe("set tables", () => {
    test("Should set the tables data when given valid data", async () => {
      JBBR.tables = Promise.resolve(tables);

      const receivedTables = await JBBR.tables;

      expect(receivedTables).toEqual(tables);
    });

    test("Should throw error when given invalid data: tables.Front.name = 'back'", async () => {
      const tablesInput = new Object(tables) as ITables;
      tablesInput.Front.name = "asdf";

      try {
        JBBR.tables = Promise.resolve(tablesInput);
        await JBBR.tables;
      } catch (error) {
        expect(error).toEqual(
          new Error('ValidationError: "Front.name" must be [Front]')
        );
      }
    });

    test("Should throw error when given invalid data: tables.Back.tables = 'isNotObject'", async () => {
      const tablesInput = new Object(tables) as ITables;
      tablesInput.Back.tables = "isNotObject" as any;

      try {
        JBBR.tables = Promise.resolve(tablesInput);
        await JBBR.tables;
      } catch (error) {
        expect(error).toEqual(
          new Error('ValidationError: "Back.tables" must be of type object')
        );
      }
    });

    test("Should throw error when given invalid data: tables.Back.tables.asdf = {name: '100', visible: 1}", async () => {
      const tablesInput = new Object(tables) as ITables;
      tablesInput.Back.tables.asdf = { name: "100", visible: 1 };

      try {
        JBBR.tables = Promise.resolve(tablesInput);
        await JBBR.tables;
      } catch (error) {
        expect(error).toEqual(
          new Error("Invalid key name within tables data: tables.Back.tables")
        );
      }
    });

    test("Should throw error when given invalid data: tables.front.tables.75 = {name: 0, visible: 1}", async () => {
      const tablesInput = new Object(tables) as ITables;
      tablesInput.Front.tables[75] = { name: 0 as any, visible: 1 };

      try {
        JBBR.tables = Promise.resolve(tablesInput);
        await JBBR.tables;
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "Invalid table object within tables data: tables.Front.tables.75"
          )
        );
      }
    });
  });
});
