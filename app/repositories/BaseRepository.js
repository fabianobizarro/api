/// <reference path="../../typings/mongoose/mongoose.d.ts" />
'use strict';

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

    findById(id, callback) {
        this.Model.findById(id, callback);
    }

    add(model, callback) {
        var _ = new this.Model(model);
        _.save(callback);
    }

    update(model, callback) {
        this.Model.update(model, callback);
    }

    delete(model, callback) {
        this.Model.remove(model, callback);
    }
}

module.exports = BaseRepository;

