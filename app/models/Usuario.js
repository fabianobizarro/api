var model = (function () {

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        crypto = require('crypto');


    var UsuarioSchema = new Schema({

        nome: {
            type: String,
            required: 'O nome do usuário é obrigatório',
            match: [
                /^[a-zA-Zà-ú ']*$/,
                'O nome do usuário não pode conter caracteres especiais'
            ]
        },
        email: {
            type: String,
            required: 'O email é obrigatório',
            match: [/.+\@.+\..+/, "O endereço de email está no formato inválido"]
        },
        login: {
            type: String,
            required: 'O login do usuário é obrigatório',
            unique: true,
            trim: true,
            index: true,
        },
        senha: {
            required: 'A senha do usuário é obrigatória',
            type: String,
            validate: [
                function (passwd) {
                    return passwd.length >= 6;
                },
                'A senha deve ter possuir 6 caracteres ou mais'
            ]
        },
        admin: {
            type: Boolean,
            default: false
        },
        salt: { type: String }

    });

    UsuarioSchema.pre('save', function (next) {

        if (this.senha) {

            this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            this.senha = this.hashPassword(this.senha);
        }

        next();
    });

    UsuarioSchema.pre('update', function (next) {
        if (this.senha) {
            this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            this.senha = this.hashPassword(this.senha);
        }
        next();
    });
    
    UsuarioSchema.methods.hashPassword = function (password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    };
    

    return {
        schemaName: 'Usuario',
        schema: UsuarioSchema
    }
    
})()

module.exports = model;