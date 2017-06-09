let nodemailer = require('nodemailer');
let aws = require('aws-sdk');

// configure AWS SDK
aws.config.loadFromPath('config.json');

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});

// send some mail
transporter.sendMail({
    from: 'ryno@chirpee.io',
    to: 'ryno@coetzee.za.com',
    subject: 'Message',
    text: 'I hope this message gets sent!',
    // ses: { // optional extra arguments for SendRawEmail
    //     Tags: [{
    //         Name: 'tag name',
    //         Value: 'tag value'
    //     }]
    // }
}, (err, info) => {
    // Error handling (err)
});