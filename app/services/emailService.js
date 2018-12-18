var nodemailer = require('nodemailer');
var env = require('../../config/env');

exports.sendMail = function (mailOptions, callback) {

    //verifica dados do provedor de email
    if (!env.emailHost)
        throw new Error('Host do provedor de email não informado');

    var transporter = nodemailer.createTransport({
        host: env.emailHost,
        port: 465,
        secure: true, // use SSL
        auth: {
            user: env.emailUsername,
            pass: env.emailPasswd
        }
    });

    transporter.sendMail(mailOptions, (err, status) => {

        if (err) {
            if (callback)
                callback(err);
        }
        else {
            if (callback)
                callback(null, status);
        }

    });

};