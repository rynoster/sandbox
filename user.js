// const moment = require("moment");
const _ = require("lodash");

const db = require("./db");

function User(id) {
    this.id = id;
}

User.prototype.allUsers = function (callback, recordCount, fromRecord) {

    db("users")
        .offset(_.toInteger(fromRecord) || 0)
        .limit(_.toInteger(recordCount) || null)
        .orderBy("first_name")
        .then((resultUsers) => {
            callback(resultUsers);
        });

};

// User.prototype.getSession = function (id, callback) {

//     db("agenda")
//         .where("id", id)
//         .first()
//         .then((resultSession) => {
//             callback(resultSession);
//         })
//         .catch((err) => {
//             callback(err);
//         });

// };

module.exports = User;
