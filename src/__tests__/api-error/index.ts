export function apiError_Tests({ ApiError }: any) {
  describe("ApiError", () => {
    it("should create properly with default values for payload & statusCode", () => {
      const message = "Test Error";

      expect(new ApiError({ message }).summary).toMatchObject({
        message,
        payload: {},
        statusCode: 400,
      });
    });

    it("should accept custom payload & statusCode", () => {
      const message = "Test Error",
        payload = { testKey: ["Some message here"] },
        statusCode = 300;

      const error = new ApiError({ message, payload, statusCode });

      expect(error.summary).toMatchObject({
        message,
        payload,
        statusCode,
      });
    });

    it("should custom payload with key & value(string | string[])", () => {
      const message = "Test Error",
        statusCode = 300;

      const values = [
        [
          { testKey: ["Some message here"] },
          { testKey: ["Some message here"] },
        ],
        [{ testKey: "Some message here" }, { testKey: ["Some message here"] }],
        [
          {
            testKey: "Some message here",
            testKey2: ["Test key 2"],
            testKey3: ["Test key 3", "Test key 3 again"],
          },
          {
            testKey: ["Some message here"],
            testKey2: ["Test key 2"],
            testKey3: ["Test key 3", "Test key 3 again"],
          },
        ],
      ];

      for (const [payload, expectedResults] of values) {
        const error = new ApiError({ message, payload, statusCode });

        expect(error.summary).toMatchObject({
          message,
          payload: expectedResults,
          statusCode,
        });
      }
    });
  });
}
