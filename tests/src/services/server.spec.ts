import fetch from "node-fetch";
import { Config } from "../../../src/config/config";
import { Database } from "../../../src/database/database";
import { Services } from "../../../src/modules/services";
import { ITable } from "../../../src/restaurants/interfaces/table.interface";
import { Server } from "../../../src/services/server";

describe("Server", () => {
  let server: Server;
  let db: Database;
  let expectedAvailableTables: ITable[];

  beforeEach(() => {
    expectedAvailableTables = [
      {
        room: "Front",
        tableID: "63",
        tableName: "101",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/63",
      },
      {
        room: "Front",
        tableID: "64",
        tableName: "102",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/64",
      },
      {
        room: "Front",
        tableID: "65",
        tableName: "103",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/65",
      },
      {
        room: "Front",
        tableID: "66",
        tableName: "104",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/66",
      },
      {
        room: "Front",
        tableID: "73",
        tableName: "4",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/73",
      },
      {
        room: "Front",
        tableID: "75",
        tableName: "1",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/75",
      },
      {
        room: "Front",
        tableID: "79",
        tableName: "5",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/79",
      },
      {
        room: "Front",
        tableID: "80",
        tableName: "6",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/80",
      },
      {
        room: "Front",
        tableID: "86",
        tableName: "205",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/86",
      },
      {
        room: "Front",
        tableID: "87",
        tableName: "206",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/87",
      },
      {
        room: "Front",
        tableID: "88",
        tableName: "207",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/88",
      },
      {
        room: "Front",
        tableID: "90",
        tableName: "201",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/90",
      },
      {
        room: "Front",
        tableID: "91",
        tableName: "202",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/91",
      },
      {
        room: "Front",
        tableID: "92",
        tableName: "203",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/92",
      },
      {
        room: "Front",
        tableID: "93",
        tableName: "204",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/93",
      },
      {
        room: "Front",
        tableID: "102",
        tableName: "3",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/102",
      },
      {
        room: "Front",
        tableID: "105",
        tableName: "7",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/105",
      },
      {
        room: "Front",
        tableID: "107",
        tableName: "501",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/107",
      },
      {
        room: "Front",
        tableID: "108",
        tableName: "2",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/108",
      },
      {
        room: "Front",
        tableID: "109",
        tableName: "7",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/109",
      },
      {
        room: "Front",
        tableID: "110",
        tableName: "8",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/110",
      },
      {
        room: "Front",
        tableID: "111",
        tableName: "9",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/111",
      },
      {
        room: "Front",
        tableID: "112",
        tableName: "10",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/112",
      },
      {
        room: "Front",
        tableID: "113",
        tableName: "11",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/113",
      },
      {
        room: "Front",
        tableID: "115",
        tableName: "12",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/115",
      },
      {
        room: "Front",
        tableID: "116",
        tableName: "13",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/116",
      },
      {
        room: "Back",
        tableID: "35",
        tableName: "301",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/35",
      },
      {
        room: "Back",
        tableID: "36",
        tableName: "302",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/36",
      },
      {
        room: "Back",
        tableID: "37",
        tableName: "303",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/37",
      },
      {
        room: "Back",
        tableID: "38",
        tableName: "304",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/38",
      },
      {
        room: "Back",
        tableID: "39",
        tableName: "305",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/39",
      },
      {
        room: "Back",
        tableID: "42",
        tableName: "51",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/42",
      },
      {
        room: "Back",
        tableID: "43",
        tableName: "52",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/43",
      },
      {
        room: "Back",
        tableID: "44",
        tableName: "53",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/44",
      },
      {
        room: "Back",
        tableID: "45",
        tableName: "54",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/45",
      },
      {
        room: "Back",
        tableID: "46",
        tableName: "55",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/46",
      },
      {
        room: "Back",
        tableID: "51",
        tableName: "61",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/51",
      },
      {
        room: "Back",
        tableID: "52",
        tableName: "62",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/52",
      },
      {
        room: "Back",
        tableID: "53",
        tableName: "63",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/53",
      },
      {
        room: "Back",
        tableID: "54",
        tableName: "64",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/54",
      },
      {
        room: "Back",
        tableID: "55",
        tableName: "65",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/55",
      },
      {
        room: "Back",
        tableID: "60",
        tableName: "307",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/60",
      },
      {
        room: "Back",
        tableID: "94",
        tableName: "12",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/94",
      },
      {
        room: "Back",
        tableID: "95",
        tableName: "11",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/95",
      },
      {
        room: "Back",
        tableID: "96",
        tableName: "22",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/96",
      },
      {
        room: "Back",
        tableID: "97",
        tableName: "21",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/97",
      },
      {
        room: "Back",
        tableID: "98",
        tableName: "32",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/98",
      },
      {
        room: "Back",
        tableID: "99",
        tableName: "31",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/99",
      },
      {
        room: "Back",
        tableID: "100",
        tableName: "42",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/100",
      },
      {
        room: "Back",
        tableID: "101",
        tableName: "41",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/101",
      },
      {
        room: "Back",
        tableID: "104",
        tableName: "306",
        visible: 1,
        QRCodePath: "http://localhost:8080/tables/qrimg/104",
      },
    ];
  });

  beforeAll(async (done) => {
    const spaceballsAccessCodesToDruidia = "12345";
    const config = new Config({
      authPassword: spaceballsAccessCodesToDruidia,
      authUsername: "test",
    });
    const services = new Services(config);
    await services.boot();
    db = services.getDatabase();
    server = services.getServer();
    server.start(done);
  });

  afterAll(async (done) => {
    await db.stop();
    server.stop(done);
  });

  describe("start", () => {
    test("Should get unauthorised message when no basic auth is given", async () => {
      const response = await fetch(
        "http://localhost:8080/tables/johnnysBurgerBar"
      ).then((res) => res.json());

      expect(response).toEqual({ code: 401, message: "Unauthorized" });
    });

    test("Should get message when correct basic auth is given", async () => {
      const availableTables = await fetch(
        "http://localhost:8080/tables/johnnysBurgerBar",
        {
          headers: {
            Authorization: "Basic dGVzdDoxMjM0NQ==",
          },
        }
      ).then((res) => res.json());

      expect(availableTables).toEqual({
        code: 200,
        message: expectedAvailableTables,
      });
    });
  });
});
