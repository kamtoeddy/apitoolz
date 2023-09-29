import { Router } from 'express'

const router = Router()

export default router

import loadVariableRoutes from './load-variables'
import makeHandlerRoutes from './make-handler'
import requestParserRoutes from './request-parser'
import useWorkerRoutes from './use-worker'

router.use('/load-variables', loadVariableRoutes)
router.use('/make-handler', makeHandlerRoutes)
router.use('/request-parser', requestParserRoutes)
router.use('/use-worker', useWorkerRoutes)
