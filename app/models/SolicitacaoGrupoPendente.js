'use strict'
module.exports = function (sequelize, DataTypes) {

    var SolicitacaoGrupoPendente = sequelize.define('SolicitacaoGrupoPendente',
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
            tableName: 'SolicitacaoGrupoPendente',
            classMethods: {
                associate: function (models) {
                }
            }
        });

    return SolicitacaoGrupoPendente;

};