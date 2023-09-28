import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import makeServer from '..'

let server

describe('useWorker with express app', () => {
  const baseUrl = '/use-worker'

  beforeEach(() => (server = makeServer()))
  afterEach(() => server?.close())

  it('should process data through desired worker files', async () => {
    const res = await request(server).get(baseUrl)

    expect(res.body).toEqual({
      message: 'data to process',
      isProcessed: true
    })
  })
})
