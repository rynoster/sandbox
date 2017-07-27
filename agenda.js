const moment = require("moment");
const _ = require("lodash");
// const request = require("request");
const fetch = require("node-fetch");
const parseXml = require("xml2js").parseString;
const schedule = require('node-schedule');

const db = require("./db");
const User = require("./user");

const user = new User();

function getScanData(sessionId, callback) {
    //This is the call to the codeReadr API to retrieve all scans on a specific session

    fetch("https://api.codereadr.com/api/?section=scans&action=retrieve&api_key=fc18285d4232b57d3a1202117c87ed20&service_id=" + sessionId)
        .then((result) => {
            return result.text();
        })
        .then((body) => {

            parseXml(body, function (err, result) {
                return callback(result.xml.scan);
            });

        })
        .catch((err) => {
            console.log(err);
        });

}

function sendSms (mobileNr, message) {

    if (process.env.NODE_ENV !== "production") {
        mobileNr = "0829091780";
    }

    fetch("http://www.mymobileapi.com/api5/http5.aspx?Type=sendparam&username=rynoster&password=iX0oQV4JOK7h&numto=" + mobileNr + "&data1=" + message, { method: "POST" })

        .then((res) => {
            return res.text();
        }).then((body) => {
            return body;
        });

}

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
        .leftJoin("speakers", "agenda.speakerId", "=", "speakers.id")
        .select("agenda.*", 
            "speakers.fullName as speakerName", "speakers.profession as speakerProfession", 
            "speakers.companyName as speakerCompany")
        .where("agenda.id", id)
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

Agenda.prototype.rateSession = function (data, callback) {

    db("sessionRatings")
        .insert(data)
        .then((result) => {
            if (result === 0) {
                callback(400);
            } else {
                callback(200);
            }
            
        })
        .catch(() => {
            callback(400);
        });

};

Agenda.prototype.smsRatings = function (callback) {

    db("agenda")
        .select("id", "title", "tabName", "timeStart", "timeEnd", "scanId", "scanSendTime")
        .whereNot("scanId", null)
        .then((resultSessions) => {

            resultSessions.forEach((breakAway) => {

                const scanSendTime = new Date(breakAway.scanSendTime);
                // const scanSendTime = new Date(2017, 6, 26, 0, 27, 0);

                //Use the following 2 lines for dev testing alone. Adds 3 seconds after program starts.
                // const scanSendTime = new Date();
                // scanSendTime.setSeconds(scanSendTime.getSeconds() + 3); 

                //Create the scheduled job for each session
                console.log("Created job for: " + breakAway.tabName + ", " + scanSendTime);
                const myJob = schedule.scheduleJob(scanSendTime, () => {
                    
                    //Retrieve the scanned data from codeReadr API, for the specific session
                    getScanData(breakAway.scanId, (scannedUsers) => {

                        if (scannedUsers) {

                            //Loop through each user that has been scanned for the specific session
                            scannedUsers.forEach((userScan) => {

                                //First retrieve the cellphone number from the user record
                                user.getUserOnEmail(userScan.tid[0], (userRecord) => {
                                    let mobileNr = userRecord.mobilenr;
                                    const message = "Dear " + userRecord.first_name + ". Thank you for attending the " + breakAway.tabName + " breakaway session. Please take a minute to rate the session. datacentrix.chirpee.io/rateSession/" + breakAway.id;

                                    //Normalise the cellphone numbers before sending to SMS gateway
                                    mobileNr = _.replace(mobileNr, "+27", "0").replace(/ /g,"");

                                    // console.log(mobileNr + " - " + message);
                                    //Send the SMS 
                                    sendSms(mobileNr, message);

                                });

                            }, this);

                        }

                    });

                });

            }, this);

        })
        .catch((err) => {
            return callback(err);
        });

};

Agenda.prototype.fullDataset = function (callback, userId) {

    const self = this;

    self.getParents((resultParents) => {

      let processedItems = 0;
      const parentRows = resultParents;

      parentRows.forEach((parent, index) => {
        
        self.getChildren(parent.id, (resultChildren) => {

            const childRows = resultChildren;

            if (resultChildren.length > 0) {
                parentRows[index].hasChildren = true;

                for (let idx = 0; idx < childRows.length; idx++) {
                    childRows[idx].parentTab = parent.tabName;
                }
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
