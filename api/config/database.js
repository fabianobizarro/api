'use strict';

exports.initialize = function (callback) {

    let models = require('../app/models');

    let forceSync = process.env.FORCE_SYNC == 'true' ? true : false;

    console.log(`Synchronizing database | Force Sync: ${forceSync}`);

    models.sequelize
        .sync({ force: forceSync })
        .then(function (database) {
            callback(null, database);
        }).catch(function (err) {
            callback(err);
        });

};