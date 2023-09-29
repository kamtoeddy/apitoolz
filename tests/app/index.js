import express from 'express'
import router from './routes'

const app = express().disable('x-powered-by')

app.use(express.json())

app.use(router)

export default function makeServer() {
  return app.listen(Math.floor(2000 + Math.random() * 1000))
}
