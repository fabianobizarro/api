var porta = 8080;
var app = require('./config/express')();

app.listen(porta);

console.log('Aplicação rodando em http://localhost:' + porta);