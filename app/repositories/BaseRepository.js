'use strict';

var Sequelize = require('sequelize');
var models = require('../models');

class BaseRepository {

    constructor(collectionName) {

        this._collectionName = collectionName;
        this.Model = models[collectionName];
    }

    getAll(fields, callback) {
        return this.Model.findAll(fields)
            .then((results) => callback(null, results), (err) => callback(err));
        //return this.Model.find({}, fields, options, callback);
    }

    find(fields, options, callback) {
        return this.Model.findAll(fields)
            .then((results) => callback(null, results), (err) => callback(err));
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
        return this.Model
            .findOne({ where: { Id: id } })
            .then(result => callback(null, result), err => callback(err));
    }

    add(model, callback) {
        return this.Model.create(model)
            .then((result) => callback(null, result), (err) => callback(err));
    }

    update(model, options, callback) {

        options = options || {};
        if (typeof model.save == 'function') {

            let o;
            if (typeof options.fields == 'object')
                o = { fields: options.fields };
            else o = {};

            return model.save(o)
                .then((result) => callback(null, result), (err) => callback(err));
        }
        else {
            return this.Model.update(model, options)
                .then((result) => callback(null, result), (err) => callback(err));
        }
    }

    delete(options, callback) {
        return this.Model.destroy(options)
            .then((result) => callback(null, result), (err) => callback(err));
    }

    count(condition, callback) {
        return this.Model.count(condition)
            .then(count => callback(null, count), err => callback(err));
    }


    query(query, options, callback) {

        if (options !== null)
            if (options.type == undefined)
                options.type = this.Model.sequelize.QueryTypes.SELECT;

        return this.Model.sequelize.query(query, options)
            .spread(function (results, metadata) {
                callback(null, results, metadata);
            }).catch(function (err) {
                callback(err);
            });
    }
}

module.exports = BaseRepository;
