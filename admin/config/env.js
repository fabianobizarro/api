var host = process.env.API_HOST ||  '127.0.0.1';
var port = process.env.API_PORT ||  3000;
var path = '/auth/signIn/admin';
var protocol = process.env.API_PROTOCOL || 'http:';
var fileServer = process.env.FILE_SERVER_URL || '';

module.exports = {
    hostname: host,
    port: port,
    path: path,
    protocol: protocol,
    fileServer: fileServer
};