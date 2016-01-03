var port = process.env.PORT = 3000;
var host = process.env.HOST = 'localhost';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Initializing application...');
var server = require('./config/express');

server.listen(port, () => {
	console.log("Server running at http://" + host + ":" + port);
});