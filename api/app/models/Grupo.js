'use strict'
module.exports = function (sequelize, DataTypes) {

    var Grupo = sequelize.define('Grupo',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            Descricao: {
                type: DataTypes.STRING(70),
                allowNull: false,
            },
            Publico: {
                type: DataTypes.BOOLEAN,
                allowNull: false
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
            tableName: 'grupo',
            classMethods: {
                associate: function (models) {

                    Grupo.belongsToMany(models.Usuario, {
                        through: {
                            model: models.IntegranteGrupo,
                            unique: true
                        },
                        foreignKey: 'GrupoId',
                        contraints: true,
                        as: 'Integrante'
                    });

                    Grupo.belongsToMany(models.Usuario, {
                        through: {
                            model: models.SolicitacaoGrupoPendente,
                            unique: true
                        },
                        foreignKey: 'GrupoId',
                        contraints: true
                    });

                    Grupo.hasMany(models.Noticia, {
                        foreignKey: 'GrupoId',
                        constraint: true,
                        as: 'Noticias'
                    });

                    Grupo.hasMany(models.IntegranteGrupo, {
                        foreignKey: 'GrupoId',
                        constraint: true,
                        as: 'Integrantes'
                    });
                }
            }
        });

    return Grupo;

};