const db = require("./db");

function Speaker(id) {
    this.id = id;
}

Speaker.prototype.allSpeakers = function (callback) {
    db("speakers")
    .orderBy("fullName")
        .then((speakers) => {
            callback(speakers);
        });
};

Speaker.prototype.getSpeaker = function (callback) {
    db("speakers")
        .where("id", this.id)
        .first()
        .then((speaker) => {
            callback(speaker);
        })
        .catch((err) => {
            callback(err);
        });
};

module.exports = Speaker;
