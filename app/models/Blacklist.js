'use strict'
module.exports = function (sequelize, DataTypes) {

    var Blacklist = sequelize.define('Blacklist',
        {
            Palavra: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                unique: { msg: 'Esta palavra já está cadastrada' },
            },
            createdBy: {
                type: DataTypes.STRING(70),
                unique: false,
                allowNull: true
            },
            updatedBy: {
                type: DataTypes.STRING(70),
                unique: false,
                allowNull: true
            }

        },
        {
            tableName: 'Blacklist',
            frezzeTableName: true,

            classMethods: {
                associate: function (models) {

                }
            }
        });

    return Blacklist;

};