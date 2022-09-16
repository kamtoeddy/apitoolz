const router = require("express").Router();

const requestParserRoutes = require("./request-parser");

router.use("/request-parser", requestParserRoutes);

module.exports = router;
