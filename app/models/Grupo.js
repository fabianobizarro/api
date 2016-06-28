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
            Publico: DataTypes.BOOLEAN

        },
        {

            frezzeTableName: true,
            tableName: 'Grupo',
            classMethods: {
                associate: function (models) {
                    Grupo.belongsToMany(models.Usuario, {
                        through: {
                            model: models.AdminGrupo,
                            unique: true
                        },
                        foreignKey: 'GrupoId',
                        contraints: true
                    });

                    Grupo.belongsToMany(models.Usuario, {
                        through: {
                            model: models.IntegranteGrupo,
                            unique: true
                        },
                        foreignKey: 'GrupoId',
                        contraints: true
                    });

                    Grupo.belongsToMany(models.Usuario, {
                        through: {
                            model: models.SolicitacaoGrupoPendente,
                            unique: true
                        },
                        foreignKey: 'GrupoId',
                        contraints: true
                    });
                }
            }
        });

    return Grupo;

};