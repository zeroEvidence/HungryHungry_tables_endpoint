import { Instance } from "../../../src/config/instance";

describe("Instance", () => {
  describe("Properties", () => {
    let instance: Instance;

    beforeAll(() => {
      instance = new Instance();
    });

    test("hungryhungryJBBRUri", () => {
      expect(instance.hungryhungryJBBRUri).toMatch(/https:\/\//);
    });

    test("hungryhungryQRTableUri", () => {
      expect(instance.hungryhungryQRTableUri).toMatch(/https:\/\//);
    });
  });
});
