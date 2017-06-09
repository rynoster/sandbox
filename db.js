var knex = require("knex");

var dbConfig = require("./config/env.json")[process.env.NODE_ENV || "dev"]

const db = knex({
    client: "mysql",
    connection: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        password: dbConfig.password
    }
})

module.exports = db;
