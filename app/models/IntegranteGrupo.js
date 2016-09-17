'use strict'
module.exports = function (sequelize, DataTypes) {

    var IntegranteGrupo = sequelize.define('IntegranteGrupo',
        {

            GrupoId: {
                type: DataTypes.INTEGER,
            },
            UsuarioId: {
                type: DataTypes.STRING(50),
            },
            Admin: {
                type: DataTypes.BOOLEAN
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
            tableName: 'IntegranteGrupo',
            classMethods: {
                associate: function (models) {

                    IntegranteGrupo.belongsTo(models.Grupo, {
                        foreignKey: 'GrupoId',
                        contraints: true,
                        as: 'Grupo',
                    });
                }
            }
        });

    return IntegranteGrupo;

};