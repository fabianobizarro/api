const fs = require('fs');
const ini = require('ini');
const path = require('path');

// var env = {

//     secret: process.env.APP_SECRET || 'secret',
//     unilesteId: process.env.INST_ID || '2',
//     dbLogUri: process.env.DBLOG_URI || 'mongodb://127.0.0.1:27017/dblog',
//     dbConnectionUri: process.env.DB_CONN_URI || 'mysql://sqluser:sqluser@127.0.0.1:3306/sn',
//     resetPasswdUrl: process.env.RESET_PASSWD_URL || 'http://localhost:8080/senha?t=',

//     emailHost: process.env.EMAIL_HOST || 'host',
//     emailUsername: process.env.EMAIL_USERNAME,
//     emailPasswd: process.env.EMAIL_PASSWD

// };



module.exports = function(){

    let filepath = path.dirname(require.main.filename) + '/.ini';
    let config = ini.parse(fs.readFileSync(filepath, 'utf-8'));

    return config;
    // return {
    //     secret: config['SECRET'],
    //     resetPasswdUrl: config['RESET_PASSWD_URL'],

    //     emailHost: config['email']['HOST'],
    //     emailUsername: config['email']['USERNAME'],
    //     emailPasswd: config['email']['PASSWORD'],
    // };
}; 