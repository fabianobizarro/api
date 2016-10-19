var nodemailer = require('nodemailer');

exports.sendMail = function (mailOptions, callback) {

    var transporter = nodemailer.createTransport({
        host: 'server5.srvlinux.info',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'username',
            pass: 'pass'
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