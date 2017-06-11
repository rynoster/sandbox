var knex = require("knex");

// var dbConfig = require("./config/env.json")[process.env.NODE_ENV || "dev"]
var dbConfig = require("./knexfile")[process.env.NODE_ENV || "development"];

const db = knex(dbConfig);

module.exports = db;
