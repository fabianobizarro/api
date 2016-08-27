'use strict'
module.exports = function (sequelize, DataTypes) {

    var Noticia = sequelize.define('Noticia',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Titulo: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            Alias: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            Resumo: {
                type: DataTypes.STRING(250),
                allowNull: true
            },
            Conteudo: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            Data: {
                type: DataTypes.DATE,
                allowNull: false
            },
            UrlImagem: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            Tags:{
                type: DataTypes.TEXT,
                allowNull: true
            },
            GrupoId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            UsuarioId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

        },
        {
            freezeTableName: true,
            tableName: 'Noticia',
            classMethods: {
                associate: function (models) {

                    Noticia.belongsTo(models.Usuario, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario_Noticia',
                    });

                    Noticia.belongsTo(models.Grupo, {
                        foreignKey: 'GrupoId',
                        contraints: true,
                        as: 'Grupo',
                    });

                    Noticia.hasMany(models.Arquivos, {
                        foreignKey: 'NoticiaId',
                        constraint: true
                    });

                    Noticia.hasMany(models.Comentario, {
                        foreignKey: 'NoticiaId',
                        contraints: true,
                        as: 'Comentarios'
                    });

                    Noticia.hasMany(models.Curtida, {
                        foreignKey: 'NoticiaId',
                        contraints: true,
                        as: 'Curtidas'
                    });
                }
            }
        });

    return Noticia;

};