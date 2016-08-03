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
            }
        },
        {
            frezzeTableName: true,
            tableName: 'IntegranteGrupo',
            classMethods: {
                associate: function (models) {
                }
            }
        });

    return IntegranteGrupo;

};