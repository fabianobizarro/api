'use strict'
module.exports = function (sequelize, DataTypes) {

    var Comentario = sequelize.define('Comentario',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Conteudo: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            Data: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            UsuarioId: {
                type: DataTypes.INTEGER,
            },
            NoticiaId: {
                type: DataTypes.INTEGER,
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

            frezzeTableName: true,
            tableName: 'Comentario',
            classMethods: {
                associate: function (models) {
                    Comentario.belongsTo(models.Noticia, {
                        foreignKey: 'NoticiaId',
                        contraints: true,
                        as: 'Noticia'
                    });

                    Comentario.belongsTo(models.Usuario, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario'
                    });
                }
            }
        });

    return Comentario;

};