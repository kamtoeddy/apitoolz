const express = require("express");

const app = express().disable("x-powered-by");

const router = require("./routes");

app.use(express.json());

app.use(router);

const server = app.listen(42042);

module.exports = server;
