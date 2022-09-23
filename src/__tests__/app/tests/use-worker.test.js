const request = require("supertest");
let server;

describe("useWorker with express app", () => {
  const baseUrl = "/use-worker";

  beforeEach(() => (server = require("..")));
  afterEach(() => server.close());

  it("should process data through desired worker files", async () => {
    const res = await request(server).get(baseUrl);

    expect(res.body).toEqual({
      message: "data to process",
      isProcessed: true,
    });
  });
});
