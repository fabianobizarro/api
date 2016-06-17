/// <reference path="../../typings/mongoose/mongoose.d.ts" />
'use strict';

var mongoose = require('mongoose');

class BaseRepository {

    constructor(collectionName, schema) {
        this._collectionName = collectionName;
        this.Model = mongoose.model(collectionName);
    }

    getAll(fields, options, callback) {
        return this.Model.find({}, fields, options, callback);
    }

    find(condition, fields, options, callback) {
        return this.Model.find(condition, fields, options, callback);
    }

    findOne(condition, fields, options, callback) {
        return this.Model.findOne(condition, fields, options, callback);
    }

    findOneAndUpdate(id, update, callback) {
        return this.Model.findOneAndUpdate(id, update, callback);
    }

    findById(id, callback) {
        this.Model.findById(id, callback);
    }

    add(model, callback) {
        var _ = new this.Model(model);
        _.save(callback);
    }

    update(model, callback) {
        model.save(callback);
    }

    delete(model, callback) {
        this.Model.remove(model, callback);
    }

    count(condition, callback) {
        this.Model.count(condition, callback);
    }
}

module.exports = BaseRepository;