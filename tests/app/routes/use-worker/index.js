import { Router } from 'express'
const router = Router()

import { useWorker } from '../../libs'

export default router

router.get('/', async (req, res) => {
  const data = await useWorker({
    path: './test-worker.js',
    data: { message: 'data to process' }
  })

  res.json(data)
})
