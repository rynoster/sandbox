var knex = require("knex");

const db = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        // password: "ericR380",
        database: "chirpee_dcx2017",
    }
})

module.exports = db;