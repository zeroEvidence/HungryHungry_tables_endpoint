import { Config } from "../../../src/config/config";
import { ITable } from "../../../src/interfaces/table.interface";
import { ITables } from "../../../src/interfaces/tables.interface";
import { Services } from "../../../src/modules/services";
import { JohnnysBurgerBarRestaurant } from "../../../src/restaurants/johnnysBurgerBarRestaurant";

describe("JohnnysBurgerBarRestaurant", () => {
  let jbbr: JohnnysBurgerBarRestaurant;
  let expectedAvailableTables: ITable[];
  let tables: ITables;
  let services: Services;

  beforeEach(async (done) => {
    expectedAvailableTables = [
      {
        room: "Front",
        tableID: "63",
        tableName: "101",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/63",
      },
      {
        room: "Front",
        tableID: "64",
        tableName: "102",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/64",
      },
      {
        room: "Front",
        tableID: "65",
        tableName: "103",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/65",
      },
      {
        room: "Front",
        tableID: "66",
        tableName: "104",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/66",
      },
      {
        room: "Front",
        tableID: "73",
        tableName: "4",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/73",
      },
      {
        room: "Front",
        tableID: "75",
        tableName: "1",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/75",
      },
      {
        room: "Front",
        tableID: "79",
        tableName: "5",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/79",
      },
      {
        room: "Front",
        tableID: "80",
        tableName: "6",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/80",
      },
      {
        room: "Front",
        tableID: "86",
        tableName: "205",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/86",
      },
      {
        room: "Front",
        tableID: "87",
        tableName: "206",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/87",
      },
      {
        room: "Front",
        tableID: "88",
        tableName: "207",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/88",
      },
      {
        room: "Front",
        tableID: "90",
        tableName: "201",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/90",
      },
      {
        room: "Front",
        tableID: "91",
        tableName: "202",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/91",
      },
      {
        room: "Front",
        tableID: "92",
        tableName: "203",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/92",
      },
      {
        room: "Front",
        tableID: "93",
        tableName: "204",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/93",
      },
      {
        room: "Front",
        tableID: "102",
        tableName: "3",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/102",
      },
      {
        room: "Front",
        tableID: "105",
        tableName: "7",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/105",
      },
      {
        room: "Front",
        tableID: "107",
        tableName: "501",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/107",
      },
      {
        room: "Front",
        tableID: "108",
        tableName: "2",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/108",
      },
      {
        room: "Front",
        tableID: "109",
        tableName: "7",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/109",
      },
      {
        room: "Front",
        tableID: "110",
        tableName: "8",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/110",
      },
      {
        room: "Front",
        tableID: "111",
        tableName: "9",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/111",
      },
      {
        room: "Front",
        tableID: "112",
        tableName: "10",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/112",
      },
      {
        room: "Front",
        tableID: "113",
        tableName: "11",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/113",
      },
      {
        room: "Front",
        tableID: "115",
        tableName: "12",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/115",
      },
      {
        room: "Front",
        tableID: "116",
        tableName: "13",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/116",
      },
      {
        room: "Back",
        tableID: "35",
        tableName: "301",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/35",
      },
      {
        room: "Back",
        tableID: "36",
        tableName: "302",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/36",
      },
      {
        room: "Back",
        tableID: "37",
        tableName: "303",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/37",
      },
      {
        room: "Back",
        tableID: "38",
        tableName: "304",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/38",
      },
      {
        room: "Back",
        tableID: "39",
        tableName: "305",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/39",
      },
      {
        room: "Back",
        tableID: "42",
        tableName: "51",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/42",
      },
      {
        room: "Back",
        tableID: "43",
        tableName: "52",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/43",
      },
      {
        room: "Back",
        tableID: "44",
        tableName: "53",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/44",
      },
      {
        room: "Back",
        tableID: "45",
        tableName: "54",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/45",
      },
      {
        room: "Back",
        tableID: "46",
        tableName: "55",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/46",
      },
      {
        room: "Back",
        tableID: "51",
        tableName: "61",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/51",
      },
      {
        room: "Back",
        tableID: "52",
        tableName: "62",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/52",
      },
      {
        room: "Back",
        tableID: "53",
        tableName: "63",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/53",
      },
      {
        room: "Back",
        tableID: "54",
        tableName: "64",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/54",
      },
      {
        room: "Back",
        tableID: "55",
        tableName: "65",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/55",
      },
      {
        room: "Back",
        tableID: "60",
        tableName: "307",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/60",
      },
      {
        room: "Back",
        tableID: "94",
        tableName: "12",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/94",
      },
      {
        room: "Back",
        tableID: "95",
        tableName: "11",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/95",
      },
      {
        room: "Back",
        tableID: "96",
        tableName: "22",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/96",
      },
      {
        room: "Back",
        tableID: "97",
        tableName: "21",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/97",
      },
      {
        room: "Back",
        tableID: "98",
        tableName: "32",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/98",
      },
      {
        room: "Back",
        tableID: "99",
        tableName: "31",
        visible: 1,
        QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/99",
      },
      {
        room: "Back",
        tableID: "100",
        tableName: "42",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/100",
      },
      {
        room: "Back",
        tableID: "101",
        tableName: "41",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/101",
      },
      {
        room: "Back",
        tableID: "104",
        tableName: "306",
        visible: 1,
        QRCodePath:
          "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/104",
      },
    ];

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

    const config = new Config({
      logger: {
        logTransports: ["console"],
        consoleLogLevel: "error",
      },
    });

    services = new Services(config);
    await services.boot();

    jbbr = await services.getJBBR();

    jbbr.tables.then(() => {
      done();
    });
  });

  describe("availableTables", () => {
    test("Should get available tables", async () => {
      const receivedAvailableTables = await jbbr.availableTables;

      expect(receivedAvailableTables).toEqual(expectedAvailableTables);
    });
  });

  describe("set tables", () => {
    test("Should set the tables data when given valid data", async () => {
      jbbr.tables = Promise.resolve(tables);
      const receivedTables = await jbbr.tables;

      expect(receivedTables).toEqual(tables);
    });

    test("Should throw error when given invalid data: tables.Front.name = 'back'", async () => {
      const tablesInput = new Object(tables) as ITables;
      tablesInput.Front.name = "asdf";

      try {
        jbbr.tables = Promise.resolve(tablesInput);
        await jbbr.tables;
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
        jbbr.tables = Promise.resolve(tablesInput);
        await jbbr.tables;
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
        jbbr.tables = Promise.resolve(tablesInput);
        await jbbr.tables;
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
        jbbr.tables = Promise.resolve(tablesInput);
        await jbbr.tables;
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
