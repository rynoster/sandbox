var moment = require("moment");
var _ = require("lodash");

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
        .where("id", id)
        .first()
        .then(function(session) {
            callback(session);
        })
        .catch(function(err) {
            callback(err);
        })
}

Agenda.prototype.getParents = function(callback){
    db("agenda")
    .where("parentId", null)
    .orWhere("parentId", 0)
    .orderBy("timeStart")
    .then(function(rows){

        rows.forEach(function(element, index){
            var timeSplitsStart = _.split(element.timeStart,":",2);
            var timeSplitsEnd = _.split(element.timeEnd,":",2);

            element.timeStart = moment( { hour:timeSplitsStart[0], minute:timeSplitsStart[1] } ).format("hh:mm");
            element.timeEnd = moment( { hour:timeSplitsEnd[0], minute:timeSplitsEnd[1] } ).format("hh:mm");
        })

      callback(rows);
    })
}

Agenda.prototype.getChildren = function(id, callback){
    db("agenda")
    .where("parentId", id)
    .join("speakers", "speakers.id", "=", "agenda.speakerId")
    .select("speakers.fullName as speakerName", "speakers.companyName as speakerCompany", "speakers.profession as speakerProfession", "agenda.*")
    .then(function(rows){
      callback(rows);
    })
}

Agenda.prototype.getSpeaker = function(id, callback){
    db("speakers")
    .where("id", id)
    .then(function(rows){
      callback(rows);
    })
}

Agenda.prototype.fullDataset = function (callback){

    var self = this;

    self.getParents(function(parentRows){

      var processedItems = 0;

      parentRows.forEach (function(element, index) {
        
        self.getChildren(element.id, function(childRows){
          if (childRows.length > 0) parentRows[index].hasChildren = true;
          parentRows[index].sessions = childRows;

          processedItems++;

          if (processedItems === parentRows.length) {
            callback(parentRows);
          }
        })

      })

    })

}//dataset function

module.exports = Agenda;