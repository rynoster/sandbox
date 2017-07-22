const nodemailer = require('nodemailer');
const aws = require('aws-sdk');

// configure AWS SDK
const awsConfig = require("./config/env.json")["awsSes"];

aws.config.accessKeyId = awsConfig.accessKeyId;
aws.config.secretAccessKey = awsConfig.secretAccessKey;
aws.config.region = awsConfig.region;

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: "2010-12-01"
    })
});

module.exports = function (params) {
    const self = this;

    self.from = params.from;
    self.to = params.to;
    self.subject = params.subject;
    self.html = params.html;
    self.successCallback = params.successCallback;
    self.errorCallback = params.errorCallback;

    this.send = function () {
        const options = {
            from: self.from,
            to: self.to,
            subject: self.subject,
            html: self.html,
        };

        transporter.sendMail(options, function (err, success) {
            if (err) {
                self.errorCallback(err);
            } else {
                self.successCallback(success);
            }
        });
    };
};
