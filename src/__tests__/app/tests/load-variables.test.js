const { loadVariables } = require("../libs");
const request = require("supertest");
let server;

describe("loadVariables (configuration)", () => {
  describe("invalid", () => {
    const errorMessage = "Invalid Environment Variables";

    const expectFailure = (fx, message) => expect(fx).toThrow(message);

    it("should reject empty variable name", () => {
      const toFail = (value) => {
        return () => {
          loadVariables({ [value]: "" });
        };
      };

      const values = ["", "  ", " env var "];

      for (const value of values) {
        expectFailure(toFail(value), errorMessage);

        try {
          toFail(value)();
        } catch (err) {
          expect(err).toEqual(
            expect.objectContaining({
              message: errorMessage,
              payload: {
                [value]: ["Should not be empty nor contain spaces"],
              },
              statusCode: 500,
            })
          );
        }
      }
    });

    it("should reject non functional parser", () => {
      const toFail = (parser) => {
        return () => {
          loadVariables({ envName: { parser } });
        };
      };

      const values = ["", null, undefined, 12, [], {}];

      for (const parser of values) {
        expectFailure(toFail(parser), errorMessage);

        try {
          toFail(parser)();
        } catch (err) {
          expect(err).toEqual(
            expect.objectContaining({
              message: errorMessage,
              payload: {
                envName: ["A parser must be a function"],
              },
              statusCode: 500,
            })
          );
        }
      }
    });
  });
});

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
