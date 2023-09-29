import { describe, expect, it } from 'vitest'

export function apiError_Tests({ ApiError }: any) {
  function getExpectedPayload(data: any) {
    return Object.keys(data).map((key) => {
      return [key, { reasons: data[key], metadata: null }] as const
    })
  }

  describe('ApiError', () => {
    it('should create properly with default values for payload & statusCode', () => {
      const message = 'Test Error'

      expect(new ApiError({ message }).summary).toEqual(
        expect.objectContaining({
          message,
          payload: {},
          statusCode: 400
        })
      )
    })

    it('should accept custom payload & statusCode', () => {
      const message = 'Test Error',
        payload = { testKey: ['Some message here'] },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      expect(error.summary).toEqual(
        expect.objectContaining({
          message,
          payload: expect.objectContaining({
            testKey: { reasons: payload.testKey, metadata: null }
          }),
          statusCode
        })
      )
    })

    it('should custom payload with key & value(string | string[])', () => {
      const message = 'Test Error',
        statusCode = 300

      const values = [
        [
          { testKey: ['Some message here'] },
          { testKey: ['Some message here'] }
        ],
        [{ testKey: 'Some message here' }, { testKey: ['Some message here'] }],
        [
          {
            testKey: 'Some message here',
            testKey2: ['Test key 2'],
            testKey3: ['Test key 3', 'Test key 3 again']
          },
          {
            testKey: ['Some message here'],
            testKey2: ['Test key 2'],
            testKey3: ['Test key 3', 'Test key 3 again']
          }
        ]
      ]

      for (const [payload, expectedResults] of values) {
        const error = new ApiError({ message, payload, statusCode })

        expect(error.summary).toMatchObject(
          expect.objectContaining({
            message,
            payload: expect.objectContaining(
              getExpectedPayload(expectedResults).reduce(
                (prev, [prop, data]) => ({ ...prev, [prop]: data }),
                {}
              )
            ),
            statusCode
          })
        )
      }
    })

    it('should tell if payload is loaded or not', () => {
      const message = 'Test Error',
        statusCode = 300

      const error = new ApiError({ message, statusCode })

      expect(error.isPayloadLoaded).toBe(false)

      error.add('test key a', 'Added test key a')

      expect(error.isPayloadLoaded).toBe(true)

      const error2 = new ApiError({
        message,
        payload: { testKey: 'test key' },
        statusCode
      })

      expect(error2.isPayloadLoaded).toBe(true)
    })

    it('should add a new field to payload object with the add method', () => {
      const message = 'Test Error',
        statusCode = 300

      const error = new ApiError({ message, statusCode })

      expect(error.summary).toEqual(
        expect.objectContaining({
          message,
          payload: {},
          statusCode
        })
      )

      error.add('test key a', 'Added test key a')

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload({
              'test key a': ['Added test key a']
            }).reduce((prev, [prop, data]) => ({ ...prev, [prop]: data }), {})
          ),
          statusCode
        })
      )
    })

    it('should add a message to an existing field of the payload object with the add method', () => {
      const message = 'Test Error',
        payload = { 'test key a': 'Added test key a' },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload({
              'test key a': ['Added test key a']
            }).reduce((prev, [prop, data]) => ({ ...prev, [prop]: data }), {})
          ),
          statusCode
        })
      )

      error.add('test key a', 'Added test key a 2')

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload({
              'test key a': expect.arrayContaining([
                'Added test key a',
                'Added test key a 2'
              ])
            }).reduce((prev, [prop, data]) => ({ ...prev, [prop]: data }), {})
          ),
          statusCode
        })
      )

      error.add('test key a', ['Added test key a 3', 'Added test key a 4'])

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload({
              'test key a': expect.arrayContaining([
                'Added test key a',
                'Added test key a 2',
                'Added test key a 3',
                'Added test key a 4'
              ])
            }).reduce((prev, [prop, data]) => ({ ...prev, [prop]: data }), {})
          ),
          statusCode
        })
      )

      error.add('test key b', ['Added test key b', 'Added test key b 1'])

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload({
              'test key a': expect.arrayContaining([
                'Added test key a',
                'Added test key a 2',
                'Added test key a 3',
                'Added test key a 4'
              ]),
              'test key b': expect.arrayContaining([
                'Added test key b',
                'Added test key b 1'
              ])
            }).reduce((prev, [prop, data]) => ({ ...prev, [prop]: data }), {})
          ),
          statusCode
        })
      )
    })

    it('should remove an existing field of the payload object with the remove method', () => {
      const message = 'Test Error',
        payload = {
          'test key a': [
            'Added test key a',
            'Added test key a 2',
            'Added test key a 3',
            'Added test key a 4'
          ],
          'test key b': ['Added test key b', 'Added test key b 1']
        },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      expect(error.summary).toEqual(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )

      error.remove('test key b')

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload({
              'test key a': [
                'Added test key a',
                'Added test key a 2',
                'Added test key a 3',
                'Added test key a 4'
              ]
            }).reduce((prev, [prop, data]) => ({ ...prev, [prop]: data }), {})
          ),
          statusCode
        })
      )
    })

    it('should do nothing when removing non existing field from the payload object with the remove method', () => {
      const message = 'Test Error',
        payload = {
          'test key a': [
            'Added test key a',
            'Added test key a 2',
            'Added test key a 3',
            'Added test key a 4'
          ],
          'test key b': ['Added test key b', 'Added test key b 1']
        },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )

      error.remove('test key c')

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )
    })

    it("should change the error's message with the setMessage method", () => {
      const message = 'Test Error',
        payload = {
          'test key a': [
            'Added test key a',
            'Added test key a 2',
            'Added test key a 3',
            'Added test key a 4'
          ],
          'test key b': ['Added test key b', 'Added test key b 1']
        },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      expect(error.summary).toEqual(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )

      const newMessage = 'New Error Message'

      error.setMessage(newMessage)

      expect(error.summary).toEqual(
        expect.objectContaining({
          message: newMessage,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )
    })

    it('should reset the error with the reset method', () => {
      const message = 'Test Error',
        payload = {
          'test key a': [
            'Added test key a',
            'Added test key a 2',
            'Added test key a 3',
            'Added test key a 4'
          ],
          'test key b': ['Added test key b', 'Added test key b 1']
        },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )

      const newMessage = 'New Error Message'

      error.setMessage(newMessage)

      expect(error.summary).toMatchObject(
        expect.objectContaining({
          message: newMessage,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      )

      error.reset()

      expect(error.summary).toEqual(
        expect.objectContaining({
          message,
          payload: {},
          statusCode
        })
      )
    })

    it('should empty the original error after the "throw" method has been invoked', () => {
      const message = 'Test Error',
        payload = {
          'test key a': [
            'Added test key a',
            'Added test key a 2',
            'Added test key a 3',
            'Added test key a 4'
          ],
          'test key b': ['Added test key b', 'Added test key b 1']
        },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      function toFail(error: any) {
        return () => error.throw()
      }

      expect(toFail(error)).toThrow(message)

      try {
        toFail(error)()
      } catch (err: any) {
        expect(err).toMatchObject({ message, payload: {}, statusCode })
      }
    })

    it('should throw the summary with the throw method', () => {
      const message = 'Test Error',
        payload = {
          'test key a': [
            'Added test key a',
            'Added test key a 2',
            'Added test key a 3',
            'Added test key a 4'
          ],
          'test key b': ['Added test key b', 'Added test key b 1']
        },
        statusCode = 300

      const error = new ApiError({ message, payload, statusCode })

      function toFail(error: any) {
        return () => error.throw()
      }

      expect(toFail(error)).toThrow(message)

      try {
        toFail(new ApiError({ message, payload, statusCode }))()
      } catch (err: any) {
        expect(err).toMatchObject({
          message,
          payload: expect.objectContaining(
            getExpectedPayload(payload).reduce(
              (prev, [prop, data]) => ({ ...prev, [prop]: data }),
              {}
            )
          ),
          statusCode
        })
      }

      const newMessage = 'New Error Message'

      error.setMessage(newMessage)

      expect(toFail(error)).toThrow(newMessage)

      error.setMessage(newMessage)

      try {
        toFail(error)()
      } catch (err: any) {
        expect(err).toMatchObject({ message: newMessage })
      }
    })
  })
}
