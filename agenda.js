var db = require("./db.js");

function Agenda(id) {
    this.id = id;
};

Agenda.prototype.allSessions = function (callback) {
    db("agenda")
    .then(function(sessions) {
        callback(sessions);
    })
};
Agenda.prototype.getSession = function (callback) {
    db("agenda")
        .where("id", this.id)
        .first()
        .then(function(session) {
            callback(session);
        })
        .catch(function(err) {
            callback(err);
        })
}

module.exports = Agenda;