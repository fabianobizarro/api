/// <reference path="../../typings/mongoose/mongoose.d.ts" />
'use strict';
var BaseRepository = (function () {

    var mongoose = require('mongoose');

    class BaseRepository {

        constructor(collectionName, schema) {
            this._collectionName = collectionName;
            this.Schema = mongoose.model(collectionName);
        }

        getAll(callback) {
            
            var c = this.Schema.constructor;
            var s = new c({nome:"Bizarrp"});
            s.save(callback);
            //this.Schema.save({ nome: 'Bizarro' }).exec(callback);
        }

        find(condition, callback) {
            return this.model.find(condition, callback);
        }
    }

    return BaseRepository;

})()

module.exports = BaseRepository;

