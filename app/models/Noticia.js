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
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            Alias: {
                type: DataTypes.STRING(40),
                allowNull: true,
            },
            Resumo: {
                type: DataTypes.STRING(100),
                allowNull: false
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
            CategoriaNoticiaId: {
                type: DataTypes.INTEGER,
                allowNull: false
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

                    Noticia.belongsTo(models.CategoriaNoticia, {
                        foreignKey: 'CategoriaNoticiaId',
                        contraints: true,
                        as: 'CategoriaNoticia_Noticia'
                    });

                    Noticia.belongsTo(models.Usuario, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario_Noticia',
                    });

                    Noticia.hasMany(models.Arquivos, {
                        foreignKey: 'NoticiaId',
                        constraint: true
                    });

                    Noticia.hasMany(models.Comentario, {
                        foreignKey: 'NoticiaId',
                        contraints: true,
                        as: 'Noticia_Comentarios'
                    });
                }
            }
        });

    return Noticia;

};