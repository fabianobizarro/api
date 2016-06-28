var config = require('./env'),
    mongoose = require('mongoose'),
    modelService = require('../app/models').ModelService;
var models = require('../app/models');

exports.initialize = function (callback) {

    var force = process.env.FORCE_SYNC || false;
    if (force)
        console.log('Forcing the database sync');
        
    models.sequelize
        .sync({ force: force })
        .then(function (database) {
            callback(null, database);
        }).catch(function (err) {
            callback(err);
        });
}


