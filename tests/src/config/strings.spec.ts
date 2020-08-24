import { Strings } from "../../../src/config/strings";

describe("Strings", () => {
  describe("The properties", () => {
    let strings: Strings;

    beforeAll(() => {
      strings = new Strings();
    });

    test("respondingWithAvailableTables", () => {
      expect(typeof strings.respondingWithAvailableTables).toEqual("string");
    });

    test("serviceUnavailable", () => {
      expect(typeof strings.serviceUnavailable).toEqual("string");
    });

    test("respondingWithQRData", () => {
      expect(typeof strings.respondingWithQRData).toEqual("string");
    });

    test("connectedToDatabase", () => {
      expect(typeof strings.connectedToDatabase).toEqual("string");
    });

    test("connectedToDatabaseEnded", () => {
      expect(typeof strings.connectedToDatabaseEnded).toEqual("string");
    });

    test("authIncomingUsernamePassword", () => {
      expect(typeof strings.authIncomingUsernamePassword).toEqual("string");
    });

    test("unauthorizedAttempt", () => {
      expect(typeof strings.unauthorizedAttempt).toEqual("string");
    });

    test("unauthorized", () => {
      expect(typeof strings.unauthorized).toEqual("string");
    });

    test("authorizedAccess", () => {
      expect(typeof strings.authorizedAccess).toEqual("string");
    });

    test("incomingRequest", () => {
      expect(typeof strings.incomingRequest).toEqual("string");
    });

    test("usingCachedTables", () => {
      expect(typeof strings.usingCachedTables).toEqual("string");
    });

    test("incomingTablesNotAnObject", () => {
      expect(typeof strings.incomingTablesNotAnObject).toEqual("string");
    });

    test("invalidKeyNameInTables", () => {
      expect(typeof strings.invalidKeyNameInTables).toEqual("string");
    });

    test("invalidObjectInTables", () => {
      expect(typeof strings.invalidObjectInTables).toEqual("string");
    });

    test("restifyListeningAt", () => {
      expect(typeof strings.restifyListeningAt).toEqual("string");
    });

    test("restifyClosed", () => {
      expect(typeof strings.restifyClosed).toEqual("string");
    });

    test("corsUnmatchedOrigin", () => {
      expect(typeof strings.corsUnmatchedOrigin).toEqual("string");
    });

    test("corsMatchedOrigin", () => {
      expect(typeof strings.corsMatchedOrigin).toEqual("string");
    });
  });
});
