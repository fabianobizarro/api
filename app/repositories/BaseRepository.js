'use strict';

var Sequelize = require('sequelize');
var models = require('../models');

class BaseRepository {

    constructor(collectionName) {

        this._collectionName = collectionName;
        this.Model = models[collectionName];
    }

    getAll(fields, callback) {
        return this.Model.findAll({ attributes: fields })
            .then((results) => callback(null, results), (err) => callback(err));
        //return this.Model.find({}, fields, options, callback);
    }

    find(condition, fields, options, callback) {
        throw new Error("Not impelmented")
        //return this.Model.find(condition, fields, options, callback);
    }

    findOne(options, callback) {
        return this.Model
            .findOne(options)
            .then((result) => callback(null, result), (err) => callback(err));

        //return this.Model.findOne(condition, fields, options, callback);

    }

    findOneAndUpdate(id, update, callback) {
        throw new Error("Not impelmented")
        //return this.Model.findOneAndUpdate(id, update, callback);
    }

    findById(id, callback) {
        throw new Error("Not impelmented")
        //this.Model.findById(id, callback);
    }

    add(model, callback) {
        //console.log(this.Model);
        return this.Model.create(model)
            .then((result) => callback(null, result), (err) => callback(err));
        // var _ = new this.Model(model);
        // _.save(callback);
    }

    update(model, callback) {

        return this.Model.update(model.dataValues, { where: { Id: model.Id } })
            .then((result) => callback(null, result), (err) => callback(err));
    }

    delete(options, callback) {
        return this.Model.destroy(options)
            .then((result) => callback(null, result), (err) => callback(err));
    }

    count(condition, callback) {
        throw new Error("Not impelmented");
    }
}

module.exports = BaseRepository;