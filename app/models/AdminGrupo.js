'use strict'
module.exports = function (sequelize, DataTypes) {

    var AdminGrupo = sequelize.define('AdminGrupo',
        {

            GrupoId: {
                type: DataTypes.INTEGER,
            },
            UsuarioId: {
                type: DataTypes.STRING(50),
            },
        },
        {
            frezzeTableName: true,
            tableName: 'AdminGrupo',
            classMethods: {
                associate: function (models) {
                }
            }
        });

    return AdminGrupo;

};