const { registerModules } = require("apitoolz");

const { loadCircular } = registerModules({ c_m1: "/sam/sample.js" });

module.exports = { loadCircular };
