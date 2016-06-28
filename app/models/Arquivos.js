'use strict'
module.exports = function (sequelize, DataTypes) {

    var Arquivos = sequelize.define('Arquivos',
        {

            NoticiaId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Url: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
        },
        {
            tableName: 'Arquivos',
            frezzeTableName: true,

            classMethods: {
                associate: function (models) {
                    Arquivos.belongsTo(models.Noticia, {
                        foreignKey: 'NoticiaId',
                        constraint: true,
                        as: 'teste'
                    });
                }
            }
        });

    return Arquivos;

};