const request = require("supertest");
let server;

describe("parseRequestKeys with express app", () => {
  beforeEach(() => (server = require("..")));
  afterEach(() => server.close());

  describe("params", () => {
    const baseUrl = "/request-parser/params";

    it("should parse request's params with default parsers(boolean & number)", async () => {
      const res = await request(server).get(`${baseUrl}/default/false/25`);

      expect(res.body).toEqual({ toParseAsBool: false, toParseAsNumber: 25 });
    });

    it("should parse request's params with default parsers(boolean & number) with nested keys to parse", async () => {
      const res = await request(server).get(
        `${baseUrl}/default/nested/true/25`
      );

      expect(res.body).toEqual({ toParseAsBool: true, toParseAsNumber: 25 });
    });

    it("should parse request's params with custom parsers", async () => {
      const res = await request(server).get(`${baseUrl}/custom/25`);

      expect(res.body).toEqual({ toParse: 25 });
    });

    it("should parse request's params with custom parsers & nested keys", async () => {
      const res = await request(server).get(`${baseUrl}/custom/nested/25`);

      expect(res.body).toEqual({ toParse: 25 });
    });
  });

  describe("query", () => {
    const baseUrl = "/request-parser/query";

    it("should parse request's query with default parsers(boolean & number)", async () => {
      const res = await request(server).get(
        `${baseUrl}/default?toParseAsBool=true&toParseAsNumber=25`
      );

      expect(res.body).toEqual({ toParseAsBool: true, toParseAsNumber: 25 });
    });

    it("should parse request's query with default parsers(boolean & number) with nested keys to parse", async () => {
      const res = await request(server).get(
        `${baseUrl}/default/nested?toParseAsBool=true&toParseAsNumber=25`
      );

      expect(res.body).toEqual({ toParseAsBool: true, toParseAsNumber: 25 });
    });

    it("should parse request's query with custom parsers", async () => {
      const res = await request(server).get(`${baseUrl}/custom?toParse=25`);

      expect(res.body).toEqual({ toParse: 25 });
    });

    it("should parse request's query with custom parsers & nested keys", async () => {
      const res = await request(server).get(
        `${baseUrl}/custom/nested?toParse=25`
      );

      expect(res.body).toEqual({ toParse: 25 });
    });
  });

  describe("params & query", () => {
    const baseUrl = "/request-parser/param-query";

    it("should parse requests with default parsers(boolean & number)", async () => {
      const res = await request(server).get(
        `${baseUrl}/default/false/25?toParseAsBool=true&toParseAsNumber=25`
      );

      const query = { toParseAsBool: true, toParseAsNumber: 25 };

      expect(res.body).toEqual({
        params: {
          toParseAsBool: false,
          toParseAsNumber: query.toParseAsNumber,
        },
        query,
      });
    });

    it("should parse requests with default parsers(boolean & number) & nested keys", async () => {
      const res = await request(server).get(
        `${baseUrl}/nested/false/25?toParseAsBool=true&toParseAsNumber=25`
      );

      const query = { toParseAsBool: true, toParseAsNumber: 25 };

      expect(res.body).toEqual({
        params: {
          toParseAsBool: false,
          toParseAsNumber: query.toParseAsNumber,
        },
        query,
      });
    });

    it("should parse requests with chained parsers", async () => {
      const res = await request(server).get(
        `${baseUrl}/chained/false/25?toParseAsBool=true&toParseAsNumber=25`
      );

      const query = { toParseAsBool: true, toParseAsNumber: 25 };

      expect(res.body).toEqual({
        params: {
          toParseAsBool: false,
          toParseAsNumber: query.toParseAsNumber,
        },
        query,
      });
    });

    it("should not parse requests with invalid default parsers", async () => {
      const res = await request(server).get(
        `${baseUrl}/invalid-default/false/25?toParseAsBool=true&toParseAsNumber=25`
      );

      const query = { toParseAsBool: "true", toParseAsNumber: "25" };

      expect(res.body).toEqual({
        params: {
          toParseAsBool: "false",
          toParseAsNumber: query.toParseAsNumber,
        },
        query,
      });
    });
  });
});
