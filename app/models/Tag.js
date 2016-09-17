'use strict'
module.exports = function (sequelize, DataTypes) {

    var Tags = sequelize.define('Tags',
        {

            NoticiaId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            Tag: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
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
            freezeTableName: true,
            tableName: 'Tags',
            classMethods: {
                associate: function (models) {
                    Tags.belongsTo(models.Noticia, {
                        foreignKey: 'NoticiaId',
                        contraints: true,
                        as: 'Noticia_Tags'
                    });
                }
            }
        });

    return Tags;

};