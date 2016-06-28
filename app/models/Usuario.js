'use strict'
module.exports = function (sequelize, DataTypes) {

    var crypto = require('crypto');

    var Usuario = sequelize.define('Usuario',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    is: { args: /^[a-zA-Zà-ú ']*$/, msg: 'O nome do usuário não pode conter caracteres especiais' }
                }
            },
            Login: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
                validate:{
                    is:{ args: /^[a-zA-Z0-9_-]{3,15}$/, msg: '' }
                }
            },
            Email: {
                type: DataTypes.STRING(70),
                allowNull: false,
                unique: true,
                isEmail: {
                    msg: 'O endereço de email está no formato inválido.'
                }
            },
            Telefone: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: false
            },
            Salt: {
                type: DataTypes.BLOB,
                allowNull: true,
                unique: false
            },
            Senha: {
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: false,
                validate: {
                    is: { args: /[A-Z.]/, msg: 'A senha deve conter pelo menos uma letra maiúscula' }
                },
            },
            UrlFoto: {
                type: DataTypes.STRING(120),
                allowNull: true,
                unique: false
            },
            Admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            Ativo: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }

        },
        {
            validate: {
                TamanhoSenha: function () {
                    let minLength = 6;
                    if (this.Senha.length < minLength)
                        throw new Error(`A senha deve ter possuir ${minLength} caracteres ou mais`);
                }
            },
            //createdAt: 'CreatedOn',
            //updatedAt: 'UpdatedOn',
            freezeTableName: true,
            tableName: 'Usuario',
            classMethods: {
                associate: function (models) {

                    Usuario.hasMany(models.Noticia, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario_Noticia',
                    });

                    Usuario.hasMany(models.Comentario, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario_Comentarios'
                    });

                    Usuario.belongsToMany(models.Grupo, {
                        through: {
                            model: models.AdminGrupo,
                            unique: true
                        },
                        foreignKey: 'UsuarioId',
                        contraints: true
                    });

                    Usuario.belongsToMany(models.Grupo, {
                        through: {
                            model: models.IntegranteGrupo,
                            unique: true
                        },
                        foreignKey: 'UsuarioId',
                        contraints: true
                    });

                    Usuario.belongsToMany(models.Grupo, {
                        through: {
                            model: models.SolicitacaoGrupoPendente,
                            unique: true
                        },
                        foreignKey: 'UsuarioId',
                        contraints: true
                    });

                },
            },

            instanceMethods: {
                hashPassword: function (password) {
                    console.log(this.Salt);
                    console.log(password);
                    return crypto.pbkdf2Sync(password, this.Salt, 10000, 64).toString('base64');
                }
            }
        });

    Usuario.beforeCreate(function (user, options) {

        if (user.Senha) {
            user.Salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            user.Senha = user.hashPassword(user.Senha);
        }

    });

    return Usuario;

};