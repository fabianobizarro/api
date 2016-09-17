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
            tableName: 'SolicitacaoGrupoPendente',
            classMethods: {
                associate: function (models) {
                }
            }
        });

    return SolicitacaoGrupoPendente;

};