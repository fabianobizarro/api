var nodemailer = require('nodemailer');

exports.sendMail = function (mailOptions, callback) {

    var transporter = nodemailer.createTransport('smtps://username%40domain:passwd@smtp.domain');

    transporter.sendMail(mailOptions, callback);

};