
//Error Hanlder:
const ErrorHanlder = require('../utils/validatorHandler.js');
const errorHanlder = new ErrorHanlder();

//Models:
const InventorytModel = require("../models/inventorys.model.js");

class ProductManager {

    //OK - Falta testear
    async getUser(email) {

        try {

            if (!email) {
                return {
                    error: 'Invalid request',
                    message: 'El usuario no fue enviado',
                    status: false
                };
            }
            
            const user = await InventorytModel.findOne({ email: email });

            if (!user) {
                return {
                    error: 'Invalid request',
                    message: 'El usuario no existe',
                    status: false
                };
            }

            return {
                status: true,
                user: user
            }

        } catch (error) {
            errorHanlder.controllerError('ProductManager - getUser', error);
            console.log("Error al obtener usuario", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al buscar el usuario',
                status: false
            };
        }
    }
    
    //OK - Falta testear
    async addProduct({ user_id, name, description, price, code, stock, category, subCategory, thumbnail }) {
        try {

            if (!name || !description || !price || !code || !stock || !category) {
                return {
                    error: 'Invalid request',
                    message: 'Uno o más de los campos obligatorios no fue enviado',
                    status: false
                };
            }

            const reqUser = await this.getUser(user_id);

            if(!reqUser.status){
                return {
                    error: reqUser.error,
                    message: reqUser.message,
                    status: false
                };
            }

            const product = reqUser.user.some(product => product.code === code);

            if (product) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto ya existe',
                    status: false
                };
            }

            const newProduct = new ProductModel({
                name,
                description,
                price,
                code,
                stock,
                category,
                subCategory,
                status: true,
                thumbnail: thumbnail || []
            });

            await newProduct.save();

            return {
                status: true
            };

        } catch (error) {
            errorHanlder.controllerError('ProductManager - addProduct', error);
            console.log("Error al agregar producto", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al agregar el producto',
                status: false
            };
        }
    }

    //OK - Falta testear
    async getItems(user_id, available, category, alfabetic) {
        try { 
            const reqUser = await this.getUser(user_id);

            if(!reqUser.status){
                return {
                    error: reqUser.error,
                    message: reqUser.message,
                    status: false
                };
            }

            // Acceder a la propiedad _doc y remover los atributos '_id', 'createdAt', y 'updatedAt'
            const clearItems = reqUser.user.map(item => {
                const { _id, createdAt, updatedAt, ...rest } = item._doc;
                return rest;
            });

            const response = {
                status: true,
                items: {}
            }

            if (available) {
                const availableItems = clearItems.filter(item => item.status === true);
                response.items = availableItems;
            }
            if (category) {
                const categorizedItems = clearItems.reduce((acc, item) => {
                    if (!acc[item.category]) {
                        acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                }, {});
                response.items = categorizedItems;
            }
            if (alfabetic) {
                const alfabeticItems = clearItems.sort((a, b) => a.name.localeCompare(b.name));
                response.items = alfabeticItems;
            }

            return response;


        } catch (error) {
            errorHanlder.controllerError('ProductManager - getItems', error);
            console.log("Error al buscar productos", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al buscar productos',
                status: false
            };
        }
    }

    //OK - Falta testear
    async getProductByCode(user_id, code) {
        try {
            const reqUser = await this.getUser(user_id);

            if(!reqUser.status){
                return {
                    error: reqUser.error,
                    message: reqUser.message,
                    status: false
                };
            }

            const product = reqUser.user.find(product => product.code === code);

            if (!product) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto no existe',
                    status: false
                };
            }
            const { _id, createdAt, updatedAt, ...clearProduct } = product._doc;
            return {
                status: true,
                product: clearProduct
            }

        } catch (error) {
            errorHanlder.controllerError('ProductManager - getProductByCode', error);
            console.log("Error al buscar producto por código", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al buscar productos',
                status: false
            };
        }
    }

    //OK - Falta testear
    async updateProduct(user_id, code, updateData) {
        try {

            const reqUser = await this.getUser(user_id);

            if(!reqUser.status){
                return {
                    error: reqUser.error,
                    message: reqUser.message,
                    status: false
                };
            }

            const product = reqUser.user.find(product => product.code === code);

            if (!product) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto no existe',
                    status: false
                };
            }
            const { _id, createdAt, updatedAt, ...clearProduct } = product._doc;

            Object.assign(clearProduct, updateData);

            await reqUser.user.save();

            return {
                status: true
            };
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            errorHanlder.controllerError('ProductManager - updateProduct', error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al actualizar el producto',
                status: false
            };
        }
    }

    //OK - Falta testear
    async deleteProduct(user_id, code) {
        try {

            const reqUser = await this.getUser(user_id);

            if(!reqUser.status){
                return {
                    error: reqUser.error,
                    message: reqUser.message,
                    status: false
                };
            }

            const itemIndex = reqUser.items.findIndex(item => item.code === code);

            if (itemIndex === -1) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto no existe',
                    status: false
                };
            }

            reqUser.items.splice(itemIndex, 1);
            await inventario.save();

            return { status: true }
            
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            errorHanlder.controllerError('ProductManager - deleteProduct', error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al eliminar el producto',
                status: false
            };
        }
    }
}

module.exports = ProductManager; 