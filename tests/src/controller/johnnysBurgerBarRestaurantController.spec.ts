import { Config } from "../../../src/config/config";
import { Strings } from "../../../src/config/strings";
import { JohnnysBurgerBarRestaurantController } from "../../../src/controllers/johnnysBurgerBarRestaurantController";
import { Database } from "../../../src/database/database";
import { TableRepository } from "../../../src/repository/tableRepository";
import { Logger } from "../../../src/utils/logger";
import { MockDatabase } from "../../__mocks/mockDatabase";
import { MockLogger } from "../../__mocks/mockLogger";
import { MockTableRepository } from "../../__mocks/mockTableRepository";

describe("JohnnysBurgerBarRestaurantController", () => {
  const expectedAvailableTables = [
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
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/102",
    },
    {
      room: "Front",
      tableID: "105",
      tableName: "7",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/105",
    },
    {
      room: "Front",
      tableID: "107",
      tableName: "501",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/107",
    },
    {
      room: "Front",
      tableID: "108",
      tableName: "2",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/108",
    },
    {
      room: "Front",
      tableID: "109",
      tableName: "7",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/109",
    },
    {
      room: "Front",
      tableID: "110",
      tableName: "8",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/110",
    },
    {
      room: "Front",
      tableID: "111",
      tableName: "9",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/111",
    },
    {
      room: "Front",
      tableID: "112",
      tableName: "10",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/112",
    },
    {
      room: "Front",
      tableID: "113",
      tableName: "11",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/113",
    },
    {
      room: "Front",
      tableID: "115",
      tableName: "12",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/115",
    },
    {
      room: "Front",
      tableID: "116",
      tableName: "13",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/116",
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
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/100",
    },
    {
      room: "Back",
      tableID: "101",
      tableName: "41",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/101",
    },
    {
      room: "Back",
      tableID: "104",
      tableName: "306",
      visible: 1,
      QRCodePath: "http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/104",
    },
  ];
  let config: Config;
  let logger: Logger;
  let tableRepo: TableRepository;
  let database: Database;

  beforeAll(() => {
    config = new Config({
      logger: {
        logTransports: ["console"],
        consoleLogLevel: "error",
      },
    });

    logger = new MockLogger({
      databasePool: {} as any,
      databaseName: config.database,
      ...config.logger,
    });

    tableRepo = new MockTableRepository() as any;

    database = new MockDatabase() as any;
  });

  describe("tables", () => {
    test("tables should send a response", async () => {
      config = new Config({
        logger: {
          logTransports: [],
        },
      });
      logger = new MockLogger({
        databasePool: {} as any,
        databaseName: config.database,
        ...config.logger,
      });

      class Jbbr {
        public get availableTables() {
          return Promise.resolve(expectedAvailableTables);
        }
      }

      const jbbr = new Jbbr();

      const jbbrController = new JohnnysBurgerBarRestaurantController(
        jbbr as any,
        logger,
        new Strings()
      );

      let sentResponse: any;
      const res = {
        send: (message) => {
          sentResponse = message;
        },
      };

      await jbbrController.tables({} as any, res as any, () => undefined);

      expect(sentResponse).toEqual({
        code: 200,
        message: expectedAvailableTables,
      });
    });

    test("tables should send an error", async () => {
      config = new Config({
        logger: {
          logTransports: [],
        },
      });
      logger = new MockLogger({
        databasePool: {} as any,
        databaseName: config.database,
        ...config.logger,
      });

      // tslint:disable-next-line: max-classes-per-file
      class Jbbr {
        public get availableTables() {
          return new Promise((resolve, reject) => {
            throw new Error("Test: Some error");
          });
        }
      }

      const jbbr = new Jbbr();

      const jbbrController = new JohnnysBurgerBarRestaurantController(
        jbbr as any,
        logger,
        new Strings()
      );

      let sentResponse: any;

      const res = {
        send: (message) => {
          sentResponse = message;
        },
      };

      await jbbrController.tables({} as any, res as any, () => undefined);

      expect(sentResponse).toEqual({
        code: 503,
        message: "Service Unavailable.",
      });
    });
  });

  describe("qrCode", () => {
    test("qrCode should send a response", async () => {
      config = new Config({
        logger: {
          logTransports: [],
        },
      });
      logger = new MockLogger({
        databasePool: {} as any,
        databaseName: config.database,
        ...config.logger,
      });

      // tslint:disable-next-line: max-classes-per-file
      class Jbbr {
        public getQRData() {
          return Promise.resolve({
            QRCodeData:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAklEQVR4AewaftIAAAeKSURBVO3BQW4ky5LAQDKh+1+Z07vxVQCJKgn/BdzM/mGtSzysdZGHtS7ysNZFHta6yMNaF3lY6yIPa13kYa2LPKx1kYe1LvKw1kUe1rrIw1oXeVjrIg9rXeSHD6n8pYpJZao4UZkqTlS+qWJSmSreUJkqTlSmihOVv1TxiYe1LvKw1kUe1rrID19W8U0qb6icVEwq31QxqUwqJyqfUJkqpopJZao4qfgmlW96WOsiD2td5GGti/zwy1TeqHijYlKZKiaVqeI3VZyoTBWTylRxojKpTBVTxSdU3qj4TQ9rXeRhrYs8rHWRH/7jVKaKSeVEZao4UZkqJpWpYlKZKj6hsv7fw1oXeVjrIg9rXeSH/7iKSWWqeEPlDZVvUpkqTireUDmp+C97WOsiD2td5GGti/zwyyr+UsWkclIxVUwqJxWfUPmEylRxUjGpfKLif8nDWhd5WOsiD2td5IcvU/lLKlPFScWkMlWcVEwqU8WkMlVMKlPFpDJVvKEyVXxC5X/Zw1oXeVjrIg9rXeSHD1X8l1VMKlPFpHKi8ptUpopJ5UTljYr/koe1LvKw1kUe1rqI/cMHVKaKSeWkYlJ5o+ITKlPFpDJVTCpTxYnKScWJyjdVnKhMFScqU8WkclLxiYe1LvKw1kUe1rrID3+s4o2Kb1J5o2JS+UTFicpUMVV8QmVSmSpOVKaKT1R808NaF3lY6yIPa13khz+mMlWcqJxUTCpTxUnFicpJxaQyVXyTylQxqZxUTConFZPKpHKiMlX8poe1LvKw1kUe1rrIDx+qOKk4UTmp+ITKVPGbKiaVk4qp4psqJpWbPax1kYe1LvKw1kV++DKVqWJSOamYVE4qTiomlU9UTCpvVLyhMlW8oXJSMamcVEwqb6icVHziYa2LPKx1kYe1LmL/8ItUpooTlanim1SmiknljYoTlZOKSWWqOFE5qZhU/lLFpHJS8YmHtS7ysNZFHta6yA9fpnKiclIxqbxRMal8ouINlTdUpoo3KiaVk4oTlaniRGWqmFROKr7pYa2LPKx1kYe1LvLDh1SmihOVE5WpYlKZKiaVb1L5popJ5UTlEypvVEwqn6iYVH7Tw1oXeVjrIg9rXeSHL1OZKk4qTlSmiknljYo3Kk5UflPFpHJSMalMFScqU8WJyqRyUjGpTBWfeFjrIg9rXeRhrYvYP3xA5ZsqPqEyVZyovFExqUwVJyqfqJhUpopJZaqYVN6oeEPljYpPPKx1kYe1LvKw1kXsHz6gMlV8QuWkYlJ5o+JE5S9VnKhMFd+k8kbFpDJVnKicVHziYa2LPKx1kYe1LvLDhyomlTcqpooTlW9SmSo+oTJVTCqfUJkq3lA5qThRmSomlanipOKbHta6yMNaF3lY6yI//I9TmSpOVKaKk4q/VHGiMlVMKpPKVDGpTBUnKlPFicobFZPKVPGJh7Uu8rDWRR7WusgPH1KZKj6hMlWcqEwVJypTxYnKVDGpTBWTyhsVb1RMKlPFicobFScqb1R808NaF3lY6yIPa13E/uEDKicVb6i8UTGpnFRMKlPFpDJVnKhMFZ9QeaPim1ROKv6XPKx1kYe1LvKw1kXsH75I5aTiRGWqeENlqnhD5Y2KE5Wp4kTlN1VMKicVJypvVPymh7Uu8rDWRR7Wuoj9wwdUpopJ5aRiUjmpeEPlpOJEZap4Q2WqmFTeqPhLKlPFpDJVTConFd/0sNZFHta6yMNaF7F/+A9R+UTFicpUcaIyVUwqU8WkclIxqUwVk8pUcaIyVZyovFExqZxUfOJhrYs8rHWRh7UuYv/wRSpTxYnKJyomlaliUpkqJpWpYlL5TRVvqJxUTCpvVJyoTBWTyknFNz2sdZGHtS7ysNZFfviQylQxqUwVU8UnVKaKSWWqmFTeqJhUpopPqHyi4hMVJypvVEwqk8pU8YmHtS7ysNZFHta6yA8fqjipmFSmihOVk4pJZao4qZhUTlSmihOVqWJSOal4Q2WqeEPlm1Smit/0sNZFHta6yMNaF/nhj1W8UXGicqIyVUwqU8UnVKaKNyomlTcqJpWpYlKZKt5Q+YTKVPGJh7Uu8rDWRR7WusgPH1L5SxXfVDGpTBUnKt+kMlWcqJxUfEJlqviEym96WOsiD2td5GGti/zwZRXfpPKXKk4qJpWp4kRlqvhNKp+o+ETFico3Pax1kYe1LvKw1kV++GUqb1S8UTGpfELlpGKqOFGZKt5QeUPlpGJSmVQ+oTJVTCq/6WGtizysdZGHtS7yw3+cyknFpHJScaIyVUwqb6hMFVPFicpUMalMKicVk8pUMamcqJxUfNPDWhd5WOsiD2td5IfLVHxC5aRiUnlD5UTlpGKqOKmYVE5UvqliUvlND2td5GGtizysdZEfflnFb6o4UflLFZPKVDGpTBWfUPlExYnKGypTxW96WOsiD2td5GGti/zwZSp/SeWNihOVqWJSmSomlaliUpkqTlR+U8WJylQxqbyhclLxiYe1LvKw1kUe1rqI/cNal3hY6yIPa13kYa2LPKx1kYe1LvKw1kUe1rrIw1oXeVjrIg9rXeRhrYs8rHWRh7Uu8rDWRR7Wusj/Abbw4ZRRq5h0AAAAAElFTkSuQmCC",
          });
        }
      }

      const jbbr = new Jbbr();

      const jbbrController = new JohnnysBurgerBarRestaurantController(
        jbbr as any,
        logger,
        new Strings()
      );

      let sentResponse: any;

      const res = {
        send: (message) => {
          sentResponse = message;
        },
      };

      const req = {
        params: {
          tableid: "63",
        },
      };

      await jbbrController.qrCode(req as any, res as any, () => undefined);

      expect(sentResponse).toEqual({
        code: 200,
        message:
          "data:image/png;base64,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",
      });
    });

    test("qrCode should send an error", async () => {
      const jbbr = {
        getQRData: (tableid) =>
          new Promise((resolve, reject) => {
            throw new Error("Test: Some error happened");
          }),
      };

      const jbbrController = new JohnnysBurgerBarRestaurantController(
        jbbr as any,
        logger,
        new Strings()
      );

      let sentResponse: any;

      const res = {
        send: (message) => {
          sentResponse = message;
        },
      };

      await jbbrController.qrCode({} as any, res as any, () => undefined);

      expect(sentResponse).toEqual({
        code: 503,
        message: "Service Unavailable.",
      });
    });
  });
});
