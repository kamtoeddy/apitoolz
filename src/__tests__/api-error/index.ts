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

    it("should tell if payload is loaded or not)", () => {
      const message = "Test Error",
        statusCode = 300;

      const error = new ApiError({ message, statusCode });

      expect(error.isPayloadLoaded).toBe(false);

      error.add("test key a", "Added test key a");

      expect(error.isPayloadLoaded).toBe(true);

      const error2 = new ApiError({
        message,
        payload: { testKey: "test key" },
        statusCode,
      });

      expect(error2.isPayloadLoaded).toBe(true);
    });

    it("should add a new field to payload object with the add method)", () => {
      const message = "Test Error",
        statusCode = 300;

      const error = new ApiError({ message, statusCode });

      expect(error.summary).toMatchObject({ message, payload: {}, statusCode });

      error.add("test key a", "Added test key a");

      expect(error.summary).toMatchObject({
        message,
        payload: { "test key a": ["Added test key a"] },
        statusCode,
      });
    });

    it("should add a message to an existing field of the payload object with the add method)", () => {
      const message = "Test Error",
        payload = { "test key a": "Added test key a" },
        statusCode = 300;

      const error = new ApiError({ message, payload, statusCode });

      expect(error.summary).toMatchObject({
        message,
        payload: { "test key a": ["Added test key a"] },
        statusCode,
      });

      error.add("test key a", "Added test key a 2");

      expect(error.summary).toMatchObject({
        message,
        payload: {
          "test key a": expect.arrayContaining([
            "Added test key a",
            "Added test key a 2",
          ]),
        },
        statusCode,
      });

      error.add("test key a", ["Added test key a 3", "Added test key a 4"]);

      expect(error.summary).toMatchObject({
        message,
        payload: {
          "test key a": expect.arrayContaining([
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ]),
        },
        statusCode,
      });

      error.add("test key b", ["Added test key b", "Added test key b 1"]);

      expect(error.summary).toMatchObject({
        message,
        payload: {
          "test key a": expect.arrayContaining([
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ]),
          "test key b": expect.arrayContaining([
            "Added test key b",
            "Added test key b 1",
          ]),
        },
        statusCode,
      });
    });

    it("should remove an existing field of the payload object with the remove method)", () => {
      const message = "Test Error",
        payload = {
          "test key a": [
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ],
          "test key b": ["Added test key b", "Added test key b 1"],
        },
        statusCode = 300;

      const error = new ApiError({ message, payload, statusCode });

      expect(error.summary).toMatchObject({ message, payload, statusCode });

      error.remove("test key b");

      expect(error.summary).toMatchObject({
        message,
        payload: {
          "test key a": [
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ],
        },
        statusCode,
      });
    });

    it("should do nothing when removing non existing field from the payload object with the remove method)", () => {
      const message = "Test Error",
        payload = {
          "test key a": [
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ],
          "test key b": ["Added test key b", "Added test key b 1"],
        },
        statusCode = 300;

      const error = new ApiError({ message, payload, statusCode });

      expect(error.summary).toMatchObject({ message, payload, statusCode });

      error.remove("test key c");

      expect(error.summary).toMatchObject({ message, payload, statusCode });
    });

    it("should change the error's message with the setMessage method)", () => {
      const message = "Test Error",
        payload = {
          "test key a": [
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ],
          "test key b": ["Added test key b", "Added test key b 1"],
        },
        statusCode = 300;

      const error = new ApiError({ message, payload, statusCode });

      expect(error.summary).toMatchObject({ message, payload, statusCode });

      error.setMessage("New Error Message");

      expect(error.summary).toMatchObject({
        message: "New Error Message",
        payload,
        statusCode,
      });
    });

    it("should reset the error with the reset method)", () => {
      const message = "Test Error",
        payload = {
          "test key a": [
            "Added test key a",
            "Added test key a 2",
            "Added test key a 3",
            "Added test key a 4",
          ],
          "test key b": ["Added test key b", "Added test key b 1"],
        },
        statusCode = 300;

      const error = new ApiError({ message, payload, statusCode });

      expect(error.summary).toMatchObject({ message, payload, statusCode });

      error.setMessage("New Error Message");

      expect(error.summary).toMatchObject({
        message: "New Error Message",
        payload,
        statusCode,
      });

      error.reset();

      expect(error.summary).toMatchObject({ message, statusCode });
      expect(error.summary.payload).toEqual({});
    });
  });
}
