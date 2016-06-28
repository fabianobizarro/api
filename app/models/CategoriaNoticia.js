'use strict'

var sequelizeTransforms = require('sequelize-transforms');

module.exports = function (sequelize, DataTypes) {

    var CategoriaNoticia = sequelize.define('CategoriaNoticia',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    is: { args: /^[a-zA-Zà-ú 0-9]*$/, msg: 'Este campo não pode conter caracteres especiais' }
                },
                trim: true
            },
            Descricao: {
                type: DataTypes.STRING(70),
                allowNull: false,
                validate: {
                    is: { args: /^[a-zA-Zà-ú 0-9]*$/, msg: 'Este campo não pode conter caracteres especiais' }
                },
                trim: true
            }

        },
        {
            frezzeTableName: true,
            tableName: 'CategoriaNoticia',
            classMethods: {
                associate: function (models) {
                    CategoriaNoticia.hasMany(models.Noticia, {
                        foreignKey: 'CategoriaNoticiaId',
                        contraints: true,
                        as: 'CategoriaNoticia_Noticia',
                        onDelete: 'NO ACTION'
                    });
                }
            }
        });

    sequelizeTransforms(CategoriaNoticia);
    
    return CategoriaNoticia;

};