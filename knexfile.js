var dbConfig = require("./config/env.json");

module.exports = {
    development: {
        client: "mysql",
        connection: {
            user: "root",
            database: "chirpee_dcx2017",
            host: "127.0.0.1"
        }
    },

    production: dbConfig.prod
}


// module.exports = {
//     dev : dbConfig.dev,

//     prod : dbConfig.prod
// }