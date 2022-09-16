const router = require("express").Router();

const loadVariableRoutes = require("./load-variables");
const makeHandlerRoutes = require("./make-handler");
const requestParserRoutes = require("./request-parser");

router.use("/load-variables", loadVariableRoutes);
router.use("/make-handler", makeHandlerRoutes);
router.use("/request-parser", requestParserRoutes);

module.exports = router;
