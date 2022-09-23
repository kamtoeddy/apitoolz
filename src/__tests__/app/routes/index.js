const router = require("express").Router();

const loadVariableRoutes = require("./load-variables");
const makeHandlerRoutes = require("./make-handler");
const requestParserRoutes = require("./request-parser");
const useWorkerRoutes = require("./use-worker");

router.use("/load-variables", loadVariableRoutes);
router.use("/make-handler", makeHandlerRoutes);
router.use("/request-parser", requestParserRoutes);
router.use("/use-worker", useWorkerRoutes);

module.exports = router;
