const request = require("supertest");
let server;

describe("loadVariables with express app", () => {
  beforeEach(() => (server = require("..")));
  afterEach(() => server.close());

  describe("defaults", () => {
    const baseUrl = "/load-variables/defaults";

    it("should return default values not in `env` as configured", async () => {
      const res = await request(server).get(baseUrl);

      expect(res.body).toEqual({
        DB_NAME: "test-db",
        ETA: 20,
        IS_DEBUG_OPEN: false,
        TO_REJECT: ["apple", "potato"],
      });
    });

    it("should return parsed values not in `env` as configured", async () => {
      const res = await request(server).get(`${baseUrl}/parsed`);

      expect(res.body).toEqual({ MAX_TIME_TO_CANCEL: 25 });
    });
  });

  describe("env", () => {
    const baseUrl = "/load-variables/env";

    it("should return values in env but not parsed", async () => {
      const res = await request(server).get(baseUrl);

      expect(res.body).toEqual({ ENV_STRING_VAL: "yoyo" });
    });

    it("should return parsed env values", async () => {
      const res = await request(server).get(`${baseUrl}/parsed`);

      expect(res.body).toEqual({ ENV_NUMBER_VAL_PARSED: 1000 });
    });
  });
});
