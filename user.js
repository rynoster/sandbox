// const moment = require("moment");
const _ = require("lodash");
const hjs = require("hjs");
const fs = require("fs");
const bcrypt = require("bcrypt-nodejs");
const url = require("url");

const db = require("./db");
const Mail = require("./email");


//helper functions
function getFullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    // pathname: req.originalUrl
  });
}

function randomString(length, chars) {

  let result = "";

  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

  return result;

}

function buildHtmlBodyParking(user, fullUrl) {

  const htmlFile = fs.readFileSync(__dirname + "/views/emailParking.hjs", "utf8");

  const htmlCompile = hjs.compile(htmlFile);
  const htmlRender = htmlCompile.render({
    delegateName: user.first_name + " " + user.last_name,
    parkingUrl: fullUrl + "/parkingVoucher.pdf",
  });

//   console.log(htmlRender);

  return (htmlRender);

}

function buildHtmlBody(user, password, fullUrl) {

  const htmlFile = fs.readFileSync(__dirname + "/views/emailAgenda.hjs", "utf8");

  const htmlCompile = hjs.compile(htmlFile);
  const htmlRender = htmlCompile.render({
    delegateName: user.first_name + " " + user.last_name,
    passwordUrl: fullUrl + "/login?email=" + user.email + "&firstLogin=" + password
  });

//   console.log(htmlRender);

  return (htmlRender);

}

function mailDelegateParking(user, req) {

        let emailAddress;

        if (process.env.NODE_ENV === "production") {
             emailAddress = user.email;
        } else {
            emailAddress = "ryno@coetzee.za.com";
        }

        const mail = new Mail({
            from: "noreply@chirpee.io",
            to: emailAddress,
            subject: "Datacentrix Showcase 2017 - Parking voucher",
            html: buildHtmlBodyParking(user, getFullUrl(req)),

            successCallback: function (success) {
                console.log("Parking mail sent to " + user.email);

                db("users")
                    .where("id", user.id)
                    .update("parkingSent", 1)
                    .then((result) => {
                        console.log("Parking record updated for: " + user.email);
                    })
                    .catch(() => {
                        console.log("Could not update parking record for: " + user.email);
                    });

            },
            errorCallback: function (err) {
                console.error("Parking mail could not be sent to " + user.email);
            }
        });

        mail.send();

}

function mailDelegate(user, req) {

    const genPassword = randomString(10, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const hashPassword = bcrypt.hashSync(genPassword);

    db("users")
    .where("id", user.id)
    .update("password", hashPassword)
    .update("passwordSent", 1)
    .then((result) => {
        console.log("Password generated and record updated for: " + user.email);

        let emailAddress;

        if (process.env.NODE_ENV === "production") {
             emailAddress = user.email;
        } else {
            emailAddress = "ryno@coetzee.za.com";
        }

        const mail = new Mail({
            from: "noreply@chirpee.io",
            to: emailAddress,
            subject: "Datacentrix Showcase 2017 - Tailor your agenda",
            html: buildHtmlBody(user, genPassword, getFullUrl(req)),

            successCallback: function (success) {
                console.log("Mail sent to " + user.email);
            },
            errorCallback: function (err) {
                console.error("Mail could not be sent to " + user.email);
            }
        });

        mail.send();

    })
    .catch(() => {
        console.log("Could not generate password or update record for: " + user.email);
    });

}

function mailDelegates(users, req) {

    _.forEach(users, (user) => {

        mailDelegate(user, req);

    });

    return users;
}

function mailDelegatesParking(users, req) {

    _.forEach(users, (user) => {

        mailDelegateParking(user, req);

    });

    return users;
}


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

User.prototype.getUserOnEmail = function (email, callback) {

    db("users")
        .where("email", email)
        .first()
        .then((resultUser) => {
            callback(resultUser);
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

User.prototype.allUsersNotPrinted = function (callback, recordCount, 
    firstNameFilter, eventProfileFilter) {

    const sqlRecordCount = recordCount || 20;
    const sqlFirstNameFilter = firstNameFilter || "";
    const sqlEventProfileFilter = eventProfileFilter || "%";

    db.raw("SELECT id, email, event_profile, pro_profile, company, \
        first_name, last_name, cardPrinted FROM users WHERE \
        cardPrinted IS NULL AND admin = 0 AND event_profile = '" + sqlEventProfileFilter + "' \
        AND first_name LIKE '" + sqlFirstNameFilter + "%' \
        ORDER BY first_name LIMIT " + 
        sqlRecordCount)
        
        .then((resultUsers) => {
            callback(resultUsers[0]);
        });

};

User.prototype.searchFirstLast = function (callback, searchQuery) {

    // db("users")
        // .where("first_name", "LIKE", userFirstName + "%")
        
    db.raw("SELECT * FROM users WHERE CONCAT(first_name, ' ', last_name) LIKE '%" + searchQuery + "%' LIMIT 10")
        .then((resultUsers) => {
            callback(resultUsers[0]);
        })
        .catch((error) => {
            console.log(error);
        })
        ;
};

User.prototype.updateMySessions = function (id, data, callback) {

    db("users")
        .where("id", id)
        .update(data)
        .then((result) => {
            callback(200);
        })
        .catch((err) => {
            callback(400);
        });
    
};

User.prototype.delegatePasswordsAll = function (callback, req) {

    db("users")
        .where("passwordSent", 0)
        .where("admin", 0)
        .where("password", null)
        .limit(req.body.limit || null)
        .then((result) => {
            return mailDelegates(result, req);
        })
        .then((result) => {
            callback(result); //Callback to delegatePasswords API
        })
        .catch((err) => {
            callback(err);
        });
    
};

User.prototype.batchMailParking = function (req, callback) {

    const recordLimit = req.body.limit || 20;

    db("users")
        .where("parkingSent", 0)
        .where("admin", 0)
        .whereNot("email", "LIKE", "%bcx.co.za")
        .whereNot("email", "LIKE", "%eoh%")
        .whereNot("email", "LIKE", "%aptronics%")
        .whereNot("email", "LIKE", "%bt-sa%")
        .whereNot("regComplete", -1)
        .limit(recordLimit || null)
        .then((result) => {
            // return console.log(result);
            return mailDelegatesParking(result, req);
        })
        .then((result) => {
            callback(result); //Callback to delegatePasswords API
        })
        .catch((err) => {
            callback(err);
        });

};

module.exports = User;
