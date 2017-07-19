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

User.prototype.userSessions = function (callback, userId) {

    db("users")
        .where("id", userId)
        .select("block1", "block2", "block3", "block4", "block5", "block6")
        .then((resultUser) => {
            callback(resultUser);
        });

};

User.prototype.allUsersNotPrinted = function (callback, recordCount, fromRecord) {

    const sqlRecordCount = recordCount || 20;
    const sqlFromRecord = fromRecord || 0;

    db.raw("SELECT id, email, event_profile, pro_profile, company, \
        CONCAT(UCASE(SUBSTRING(`first_name`, 1, 1)), LOWER(SUBSTRING(`first_name`, 2))) \
        AS first_name, CONCAT(UCASE(SUBSTRING(`last_name`, 1, 1)), \
        LOWER(SUBSTRING(`last_name`, 2))) AS last_name, cardPrinted FROM users WHERE \
        cardPrinted IS NULL AND admin = 0 ORDER BY first_name LIMIT " + 
        sqlRecordCount + " OFFSET " + sqlFromRecord)
        
        .then((resultUsers) => {
            callback(resultUsers[0]);
        });

    // db("users")
    //     .offset(_.toInteger(fromRecord) || 0)
    //     .limit(_.toInteger(recordCount) || null)
    //     .orderBy("first_name")
    //     .where("cardPrinted", null)
    //     .then((resultUsers) => {
    //         callback(resultUsers);
    //     });

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
