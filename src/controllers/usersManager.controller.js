//Utils
const { createHash } = require("../utils/hashbcrypt.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");
//Error Hanlder
const ErrorHanlder = require('../utils/validatorHandler.js');
const errorHanlder = new ErrorHanlder();

//Models:
const UsersModel = require("../models/users.model.js");

class UsersManager {

    //OK - Testeado
    async registerUser({ name, email, password }) {
        
        if (!name || !email || !password) {
            return {
                error: 'Invalid request',
                message: 'Uno o más de los campos obligatorios no fue enviado',
                status: false
            };
        }
        
        //Validamos si el usuario existe
        const existingUser = await UsersModel.findOne({ email: email });
        if (existingUser) {
            return {
                error: 'Invalid request',
                message: 'El email ya está registrado',
                status: false
            };
        }

        // Crear un nuevo usuario con rol de usuario por defecto
        const newUser = await UsersModel.create({ 
            name, 
            email, 
            password: createHash(password), 
            role: 'user'
        });

        return { status: true, user: newUser };
    }

    //OK - Falta testear
    async loginUser (email, password) {
        try {
            if (!email || !password) {
                return {
                    code: 400,
                    error: 'Invalid request',
                    message: 'Uno o más de los campos obligatorios no fue enviado',
                    status: false
                };
            }
            //Validamos si el usuario existe
            const existingUser = await UsersModel.findOne({ email: email });
            if (!existingUser) {
                return {
                    code: 409,
                    error: 'Invalid request',
                    message: 'El email no está registrado',
                    status: false
                };
            }

            //Validamos la contraseña
            if (!isValidPassword(password, existingUser)) {
                return {
                    code: 400,
                    error: 'Invalid request',
                    message: 'La contraseña es incorrecta',
                    status: false
                };
            }

            return { status: true, user: existingUser };

        } catch (error) {
            errorHanlder.controllerError('UsersManager - loginUser', error);
            console.log("Error al loguear usuario", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al loguear el usuario',
                status: false
            }
        }
    }

    //OK - Falta testear
    async getUsers(email, password, token) {
        try {
            const flag = await this.loginUser(email, password);

            if(!flag.status){
                return {
                    code: flag.code,
                    error: flag.error,
                    message: flag.message,
                    status: false
                };
            }
            if(token !== process.env.ADMIN_TOKEN || flag.user.role !== 'admin'){
                return {
                    code: 403,
                    error: 'Unauthorized',
                    message: 'No tienes permisos para realizar esta acción',
                    status: false
                };
            }

            const users = await UsersModel.find();

            return { status: true, users: users };

        } catch (error) {
            errorHanlder.controllerError('UsersManager - getUsers', error);
            console.log("Error al obtener usuarios", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al obtener los usuarios',
                status: false
            };
        }
    }
}

module.exports = UsersManager;