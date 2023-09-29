import { Router } from 'express'
const router = Router()

import { parseRequestKeys } from '../libs'

export default router

const getParser = (key) =>
  parseRequestKeys({
    [key]: { toParseAsBool: 'boolean', toParseAsNumber: 'number' }
  })

const getNestedParser = (key) =>
  parseRequestKeys({
    [`${key}.toParseAsBool`]: 'boolean',
    [`${key}.toParseAsNumber`]: 'number'
  })

const customParser = (key) =>
  parseRequestKeys({ [key]: { toParse: (v) => Number(v) } })

const customNestedParser = (key) =>
  parseRequestKeys({ [`${key}.toParse`]: (v) => Number(v) })

// params
router.get(
  '/params/default/:toParseAsBool/:toParseAsNumber',
  getParser('params'),
  (req, res) => res.json(req.params)
)

router.get(
  '/params/default/nested/:toParseAsBool/:toParseAsNumber',
  getNestedParser('params'),
  (req, res) => res.json(req.params)
)

router.get('/params/custom/:toParse', customParser('params'), (req, res) => {
  res.json(req.params)
})

router.get(
  '/params/custom/nested/:toParse',
  customNestedParser('params'),
  (req, res) => res.json(req.params)
)

// query
router.get('/query/default', getParser('query'), (req, res) => {
  res.json(req.query)
})

router.get('/query/default/nested', getNestedParser('query'), (req, res) => {
  res.json(req.query)
})

router.get('/query/custom', customParser('query'), (req, res) => {
  res.json(req.query)
})

router.get('/query/custom/nested', customNestedParser('query'), (req, res) => {
  res.json(req.query)
})

// params & query
const parser = parseRequestKeys({
  params: { toParseAsBool: 'boolean', toParseAsNumber: 'number' },
  query: { toParseAsBool: 'boolean', toParseAsNumber: 'number' }
})

const _nestedParser = parseRequestKeys({
  'params.toParseAsBool': 'boolean',
  'params.toParseAsNumber': 'number',
  'query.toParseAsBool': 'boolean',
  'query.toParseAsNumber': 'number'
})

router.get(
  '/param-query/default/:toParseAsBool/:toParseAsNumber',
  parser,
  ({ params, query }, res) => res.json({ params, query })
)

router.get(
  '/param-query/nested/:toParseAsBool/:toParseAsNumber',
  _nestedParser,
  ({ params, query }, res) => res.json({ params, query })
)

router.get(
  '/param-query/chained/:toParseAsBool/:toParseAsNumber',
  getParser('params'),
  getNestedParser('query'),
  ({ params, query }, res) => res.json({ params, query })
)

// invalid parsers
const invalidParser = parseRequestKeys({
  params: { toParseAsBool: 'array', toParseAsNumber: 'object' },
  query: { toParseAsBool: 'tea', toParseAsNumber: 'orange' },
  'apples.toParseAsBool': 'boolean',
  'apples.toParseAsNumber': 'number',
  pineapples: { toParseAsBool: 'tea', toParseAsNumber: 'orange' }
})

router.get(
  '/param-query/invalid-default/:toParseAsBool/:toParseAsNumber',
  invalidParser,
  ({ params, query }, res) => res.json({ params, query })
)
