var knex = require("knex");

const db = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        user: "rynoster",
        password: "ch1rp3eSQL%connection",
        database: "chirpee_dcx2017",
    }
})

module.exports = db;