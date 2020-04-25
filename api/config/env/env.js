

var env = {

    secret: process.env.APP_SECRET || 'secret',
    unilesteId: process.env.INST_ID || '2',
    dbLogUri: process.env.DBLOG_URI || 'mongodb://127.0.0.1:27017/dblog',
    dbConnectionUri: process.env.DB_CONN_URI || 'mysql://root:root@127.0.0.1:3306/sn',
    resetPasswdUrl: process.env.RESET_PASSWD_URL || 'http://localhost:8080/senha?t=',

    emailHost: process.env.EMAIL_HOST || 'host',
    emailUsername: process.env.EMAIL_USERNAME,
    emailPasswd: process.env.EMAIL_PASSWD

};

module.exports = env; 