var db = require("./db.js");

function Speaker(id) {
    this.id = id;
}

Speaker.prototype.allSpeakers = function (callback) {
    db("speakers")
    .orderBy("fullName")
        .then(function(speakers) {
            callback(speakers);
        })
};

Speaker.prototype.getSpeaker = function (callback) {
    db("speakers")
        .where("id", this.id)
        .first()
        .then(function(speaker) {
            callback(speaker);
        })
        .catch(function(err) {
            callback(err);
        })
}

module.exports = Speaker;