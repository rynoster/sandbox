// const moment = require("moment");
// const _ = require("lodash");

const db = require("./db");

function User(id) {
    this.id = id;
}

User.prototype.allUsers = function (callback) {
    
    db("users")
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
