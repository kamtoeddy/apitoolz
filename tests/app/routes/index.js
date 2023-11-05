import { Router } from 'express';

const router = Router();

export default router;

import makeHandlerRoutes from './make-handler';
import requestParserRoutes from './request-parser';
import useWorkerRoutes from './use-worker';

router.use('/make-handler', makeHandlerRoutes);
router.use('/request-parser', requestParserRoutes);
router.use('/use-worker', useWorkerRoutes);
