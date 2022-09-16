const router = require("express").Router();

const makeHandlerRoutes = require("./makeHandler");
const requestParserRoutes = require("./request-parser");

router.use("/make-handler", makeHandlerRoutes);
router.use("/request-parser", requestParserRoutes);

module.exports = router;
