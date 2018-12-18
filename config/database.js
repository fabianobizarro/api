'use strict';
const firebase = require("firebase");
const env = require('./env')();
// exports.initialize = function (callback) {

//     console.log(process.env.DB_CONN_URI);

//     let models = require('../app/models');

//     let forceSync = process.env.FORCE_SYNC == 'true' ? true : false;

//     console.log(`Synchronizing database | Force Sync: ${forceSync}`);

//     models.sequelize
//         .sync({ force: forceSync })
//         .then(function (database) {
//             callback(null, database);
//         }).catch(function (err) {
//             callback(err, null);
//         });

// };


exports.initialize = new Promise((resolve, reject) => {

    let fb = env['firebase'];
    try {
        let config = {
            apiKey: fb['API_KEY'],
            authDomain: fb['PROJECT_ID'] + '.firebaseapp.com',
            databaseURL: fb['DB_URL'],
            storageBucket: fb['STORAGE_BUCKET'],
        };
        
        const app = firebase.initializeApp(config);
        resolve(app);
    } catch (err) {
        reject(err);
    }
    
});