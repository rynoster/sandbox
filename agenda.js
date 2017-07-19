const moment = require("moment");
const _ = require("lodash");

const db = require("./db");
const User = require("./user");

const user = new User();

function Agenda(id) {
    this.id = id;
}

Agenda.prototype.allSessions = function (callback) {
    
    db("agenda")
        .orderBy("timeStart")
        .then((resultSessions) => {
            callback(resultSessions);
        });

};

Agenda.prototype.getSession = function (id, callback) {

    db("agenda")
        .where("id", id)
        .first()
        .then((resultSession) => {
            callback(resultSession);
        })
        .catch((err) => {
            callback(err);
        });

};

Agenda.prototype.getParents = function (callback) {

    db("agenda")
        .where("parentId", null)
        .orWhere("parentId", 0)
        .orderBy("timeStart")
        .then((rows) => {

            rows.forEach((element) => {

                const timeElement = element;
                const timeSplitsStart = _.split(element.timeStart, ":", 2);
                const timeSplitsEnd = _.split(element.timeEnd, ":", 2);

                timeElement.timeStart = moment({ hour: timeSplitsStart[0], 
                    minute: timeSplitsStart[1] }).format("HH:mm");
                timeElement.timeEnd = moment({ hour: timeSplitsEnd[0], 
                    minute: timeSplitsEnd[1] }).format("HH:mm");

            });

        callback(rows);

        });

};

Agenda.prototype.getChildren = function (id, callback) {

    db("agenda")
        .where("parentId", id)
        .join("speakers", "speakers.id", "=", "agenda.speakerId")
        .select("speakers.fullName as speakerName", "speakers.companyName as speakerCompany", 
            "speakers.profession as speakerProfession", "agenda.*")
        .then((rows) => {
            callback(rows);
        });

};

Agenda.prototype.getSpeaker = function (id, callback) {

    db("speakers")
    .where("id", id)
    .then((rows) => {
      callback(rows);
    });

};

Agenda.prototype.updateSession = function (id, data, callback) {

    db("agenda")
      .where("id", id)
      .update(data)
      .then((result) => {
        if (result === 0) {
            callback(400);
        } else {
            callback(200);
        }
        
      });

};

Agenda.prototype.fullDataset = function (callback, userId) {

    const self = this;

    self.getParents((resultParents) => {

      let processedItems = 0;
      let idx = 0;
      const parentRows = resultParents;

      parentRows.forEach((element, index) => {
        
        self.getChildren(element.id, (resultChildren) => {

            const childRows = resultChildren;

            if (resultChildren.length > 0) {
                parentRows[index].hasChildren = true;
                parentRows[index].idx = idx;
                idx++;
            }

            parentRows[index].sessions = childRows;

            processedItems++;

            if (processedItems === parentRows.length) {
              
                callback(parentRows);
          }

        });

      });

    });

};  //dataset function

module.exports = Agenda;
