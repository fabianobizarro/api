
module.exports = {
    filesDir: process.env.FILES_DIR || __dirname + '/../files',
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 5000,
    protocol: process.env.PROTOCOL || 'http',
    endpoint: '/f',
    url: function(){
        return `${this.protocol}://${this.host}:${this.port}${this.endpoint}`;
    }
}