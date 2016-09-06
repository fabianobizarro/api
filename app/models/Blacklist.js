'use strict'
module.exports = function (sequelize, DataTypes) {

    var Blacklist = sequelize.define('Blacklist',
        {
            Palavra: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                unique: { msg: 'Esta palavra já está cadastrada' },
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