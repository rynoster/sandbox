var nodemailer = require('nodemailer');
var aws = require('aws-sdk');

// configure AWS SDK
var awsConfig = require("./config/env.json")["awsSes"];

aws.config.accessKeyId = awsConfig.accessKeyId;
aws.config.secretAccessKey = awsConfig.secretAccessKey;
aws.config.region = awsConfig.region;

// create Nodemailer SES transporter
var transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});

module.exports = function (params) {
    this.from = params.from;
    this.to = params.to;
    this.subject = params.subject;
    this.html = params.html;
    this.successCallback = params.successCallback;
    this.errorCallback = params.errorCallback;

    this.send = function () {
        var options = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            html: this.html,
        };

        transporter.sendMail(options, function (err, success) {
            if (err) {
                // this.errorCallback(err);
            } else {
                // this.successCallback(success);
            }
        });
    }
};