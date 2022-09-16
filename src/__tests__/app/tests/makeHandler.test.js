const request = require("supertest");
let server;

describe("makeHandler with express app", () => {
  beforeEach(() => (server = require("..")));
  afterEach(() => server.close());

  describe("defaults", () => {
    const baseUrl = "/make-handler/defaults";

    it("should return a body with {data,success:true} for successful operations", async () => {
      const res = await request(server).get(baseUrl);

      expect(res.body).toEqual({
        data: { id: 1, name: "James" },
        success: true,
      });
    });

    it("should return a body with {data,success:fasle} for unsuccessful operations", async () => {
      const res = await request(server).get(`${baseUrl}/error`);

      console.log(res.body);

      expect(res.body).toEqual({
        data: { message: "Invalid Operation", payload: {}, statusCode: 400 },
        success: false,
      });
    });
  });
});
