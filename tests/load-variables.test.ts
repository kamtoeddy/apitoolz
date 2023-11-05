import { describe, expect, it } from 'vitest';

import { loadVariables } from '../src';

describe('loadVariables (configuration)', () => {
  describe('invalid', () => {
    const errorMessage = 'Invalid Environment Variables';

    const expectFailure = (fx, message) => expect(fx).toThrow(message);

    it('should reject empty variable name', () => {
      const toFail = (value) => {
        return () => {
          loadVariables({ [value]: '' });
        };
      };

      const values = ['', '  ', ' env var '];

      for (const value of values) {
        expectFailure(toFail(value), errorMessage);

        try {
          toFail(value)();
        } catch (err) {
          expect(err).toMatchObject(
            expect.objectContaining({
              message: errorMessage,
              payload: {
                [value]: expect.objectContaining({
                  reasons: ['Should not be empty nor contain spaces']
                })
              },
              statusCode: 500
            })
          );
        }
      }
    });

    it("should reject non parser in it's not a function", () => {
      const toFail = (parser) => {
        return () => {
          loadVariables({ envName: { parser } });
        };
      };

      const values = ['', null, undefined, 12, [], {}];

      for (const parser of values) {
        expectFailure(toFail(parser), errorMessage);

        try {
          toFail(parser)();
        } catch (err) {
          expect(err).toEqual(
            expect.objectContaining({
              message: errorMessage,
              payload: {
                envName: expect.objectContaining({
                  reasons: ['A parser must be a function']
                })
              },
              statusCode: 500
            })
          );
        }
      }
    });
  });
});

describe('loaded variables', () => {
  const vars = loadVariables({
    DB_NAME: 'test-db',
    ENV_NUMBER_VAL_PARSED: { parser: (v) => Number(v) },
    ENV_STRING_VAL: '',
    ETA: 20,
    IS_DEBUG_OPEN: false,
    MAX_TIME_TO_CANCEL: { default: 25, parser: (v) => v },
    TEST_VAL: () => 'test val',
    TEST_VAL_1: { default: () => 'test-val 1' },
    TO_REJECT: { default: ['apple', 'potato'] }
  });

  describe('defaults', () => {
    it('should return default values not in `env` as configured', () => {
      expect(vars).toMatchObject({
        DB_NAME: 'test-db',
        ETA: 20,
        IS_DEBUG_OPEN: false,
        TO_REJECT: ['apple', 'potato']
      });
    });

    it('should return default values provided by setter', () => {
      expect(vars).toMatchObject({
        TEST_VAL: 'test val',
        TEST_VAL_1: 'test-val 1'
      });
    });

    it('should return parsed values not in `env` as configured', () => {
      expect(vars).toMatchObject({ MAX_TIME_TO_CANCEL: 25 });
    });
  });

  describe('env', () => {
    it('should return values in env but not parsed', () => {
      expect(vars).toMatchObject({ ENV_STRING_VAL: 'yoyo' });
    });

    it('should return parsed env values', () => {
      expect(vars).toMatchObject({ ENV_NUMBER_VAL_PARSED: 1000 });
    });

    it('should reject if "required: true" and value was not provided', () => {
      const values = [true, () => true];

      for (const required of values)
        try {
          loadVariables({ REQUIRED: { required } });
        } catch (error) {
          expect({ ...error }).toMatchObject({
            payload: {
              REQUIRED: expect.objectContaining({
                reasons: ["'REQUIRED' is a required property"]
              })
            },
            statusCode: 500
          });
        }
    });

    it('should not throw if "required: false" and value was not provided', () => {
      const values = [false, () => false];

      for (const required of values)
        expect(
          loadVariables({ REQUIRED: { required } }).REQUIRED
        ).toBeUndefined();
    });

    it('should respect transform keyword', () => {
      const vars = loadVariables(
        {
          A: 2,
          B: { default: null },
          C: { default: () => null },
          D: { parser: () => 'parsed' },
          E: { default: [], parser: () => 'parsed' },
          F: { default: () => null, parser: () => 'parsed' },
          G: () => ''
        },
        {
          transform(vars) {
            return { ...vars, config: vars };
          }
        }
      );

      const vals = {
        A: 2,
        B: null,
        C: null,
        D: undefined,
        E: [],
        F: null,
        G: ''
      };

      expect(vars).toMatchObject({ ...vals, config: vals });
    });
  });
});
