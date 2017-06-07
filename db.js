var knex = require("knex");

const db = knex({
    client: "mysql",
    connection: {
        host: "chirpdb.cmin0wgks0mn.us-east-2.rds.amazonaws.com",
        user: "sa",
        password: "ericR380",
        database: "chirp_dcx2017",
    }
})

module.exports = db;