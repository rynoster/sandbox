var knex = require("knex");

const db = knex({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        // password: "ch1rp3eSQL%connection",
        database: "chirpee_dcx2017",
    }
})

module.exports = db;
