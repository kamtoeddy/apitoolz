import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { loadVariables } from '../libs'
import makeServer from '..'

let server

describe('loadVariables (configuration)', () => {
  describe('invalid', () => {
    const errorMessage = 'Invalid Environment Variables'

    const expectFailure = (fx, message) => expect(fx).toThrow(message)

    it('should reject empty variable name', () => {
      const toFail = (value) => {
        return () => {
          loadVariables({ [value]: '' })
        }
      }

      const values = ['', '  ', ' env var ']

      for (const value of values) {
        expectFailure(toFail(value), errorMessage)

        try {
          toFail(value)()
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
          )
        }
      }
    })

    it('should reject non functional parser', () => {
      const toFail = (parser) => {
        return () => {
          loadVariables({ envName: { parser } })
        }
      }

      const values = ['', null, undefined, 12, [], {}]

      for (const parser of values) {
        expectFailure(toFail(parser), errorMessage)

        try {
          toFail(parser)()
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
          )
        }
      }
    })
  })
})

describe('loadVariables with express app', () => {
  beforeEach(() => (server = makeServer()))
  afterEach(() => server.close())

  describe('defaults', () => {
    const baseUrl = '/load-variables/defaults'

    it('should return default values not in `env` as configured', async () => {
      const res = await request(server).get(baseUrl)

      expect(res.body).toEqual({
        DB_NAME: 'test-db',
        ETA: 20,
        IS_DEBUG_OPEN: false,
        TO_REJECT: ['apple', 'potato']
      })
    })

    it('should return default values provided by setter', async () => {
      const res = await request(server).get(`${baseUrl}/by-setter`)

      expect(res.body).toEqual({
        TEST_VAL: 'test val',
        TEST_VAL_1: 'test-val 1'
      })
    })

    it('should return parsed values not in `env` as configured', async () => {
      const res = await request(server).get(`${baseUrl}/parsed`)

      expect(res.body).toEqual({ MAX_TIME_TO_CANCEL: 25 })
    })
  })

  describe('env', () => {
    const baseUrl = '/load-variables/env'

    it('should return values in env but not parsed', async () => {
      const res = await request(server).get(baseUrl)

      expect(res.body).toEqual({ ENV_STRING_VAL: 'yoyo' })
    })

    it('should return parsed env values', async () => {
      const res = await request(server).get(`${baseUrl}/parsed`)

      expect(res.body).toEqual({ ENV_NUMBER_VAL_PARSED: 1000 })
    })

    it('should respect "required" key word', async () => {
      const res = await request(server).get(`${baseUrl}/required`)

      expect(res.body).toMatchObject({
        error: expect.objectContaining({
          payload: {
            REQUIRED: expect.objectContaining({
              reasons: ['REQUIRED is a required property']
            })
          },
          statusCode: 500
        })
      })

      const res1 = await request(server).get(`${baseUrl}/required/false`)

      expect(res1.body).toEqual({ error: null })
    })

    it('should respect "required" key word as function', async () => {
      const res = await request(server).get(`${baseUrl}/required/function`)

      expect(res.body).toMatchObject({
        error: expect.objectContaining({
          payload: {
            REQUIRED: expect.objectContaining({
              reasons: ['REQUIRED is a required property']
            })
          },
          statusCode: 500
        })
      })

      const res1 = await request(server).get(
        `${baseUrl}/required/function/false`
      )

      expect(res1.body).toEqual({ error: null })
    })
  })
})
