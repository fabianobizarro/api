/// <reference path="../../typings/mongoose/mongoose.d.ts" />
'use strict';
var BaseRepository = (function () {

    var mongoose = require('mongoose');

    class BaseRepository {

        constructor(collectionName, schema) {
            this._collectionName = collectionName;
            this.Model = mongoose.model(collectionName);
        }

        getAll(callback) {
            return this.Model.find({}, callback);
        }

        find(condition, callback) {
            return this.Model.find(condition, callback);
        }
        
        add(model, callback){
            
        }
        
        update(model , callback){
            
        }
        
        delete(model, callback){
            
        }
    }

    return BaseRepository;

})()

module.exports = BaseRepository;

