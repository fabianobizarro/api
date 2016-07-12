'use strict'
module.exports = function (sequelize, DataTypes) {

    var Curtida = sequelize.define('Curtida',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Data: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            UsuarioId: {
                type: DataTypes.INTEGER,
                unique: 'CurtidaUniqueKey'
            },
            NoticiaId: {
                type: DataTypes.INTEGER,
                unique: 'CurtidaUniqueKey'
            }

        },
        {
            tableName: 'Curtida',
            frezzeTableName: true,

            classMethods: {
                associate: function (models) {
                    Curtida.belongsTo(models.Noticia, {
                        foreignKey: 'NoticiaId',
                        contraints: true,
                        as: 'Noticia',
                    });

                    

                    Curtida.belongsTo(models.Usuario, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario'
                    });
                }
            }
        });

    return Curtida;

};