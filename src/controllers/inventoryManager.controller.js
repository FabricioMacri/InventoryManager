
//Error Hanlder:
const ErrorHanlder = require('../utils/validatorHandler.js');
const errorHanlder = new ErrorHanlder();

//Models:
const InventorytModel = require("../models/inventorys.model.js");

class ProductManager {

    //OK - Testeado ✅
    async getInventory(email, name) {

        try {

            if (!email || !name) {
                return {
                    error: 'Invalid request',
                    message: 'El usuario o el nombre del inventario no fueron enviado',
                    status: false
                };
            }

            const inventory = await InventorytModel.findOne({ 
                email: email, 
                name: name 
            });

            if (!inventory) {
                return {
                    error: 'Invalid request',
                    message: 'No se encontro el inventario',
                    status: false
                };
            }
            return {
                status: true,
                inventory: inventory
            };

        } catch (error) {
            errorHanlder.controllerError('ProductManager - getInventory', error);
            console.log("Error al obtener inventario", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al buscar el inventario',
                status: false
            };
        }
    }
    //OK - Testeado ✅
    async newInventory(email, name) {
        try {

            if (!email || !name) {
                return {
                    error: 'Invalid request',
                    message: 'El usuario o el nombre del inventario no fueron enviado',
                    status: false
                };
            }

            console.log(name);
            const inventory = await this.getInventory(email, name);

            if (inventory.status) {
                return {
                    error: 'Invalid request',
                    message: 'Ya tienes un inventario con ese nombre',
                    status: false
                };
            }

            const newInventory = new InventorytModel({
                name: name,
                email: email,
                items: []
            });

            await newInventory.save();

            return {
                status: true
            };

        } catch (error) {
            errorHanlder.controllerError('ProductManager - newInventory', error);
            console.log("Error al crear inventario", error);
            return {
                error: 'Internal server error',
                message: 'Hubo un problema al crear el inventario',
                status: false
            };
        }
    }
    //OK - Testeado ✅
    async addItem(props) {
        try {
            const { email, inventoryName, name, description, price, code, stock, category, subCategory, thumbnail } = props;
            if (!name || !price || !code || !category) {
                return {
                    error: 'Invalid request',
                    message: 'Uno o más de los campos obligatorios no fue enviado',
                    status: false
                };
            }

            const SelectedInventory = await this.getInventory(email, inventoryName);

            if(!SelectedInventory.status){
                return {
                    error: SelectedInventory.error,
                    message: SelectedInventory.message,
                    status: false
                };
            }

            const product = SelectedInventory.inventory.items.some(product => product.code === code);

            if (product) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto ya existe',
                    status: false
                };
            }

            const newProduct = {
                name,
                description: description || '',
                price,
                code,
                stock: stock|| 0,
                category,
                subCategory: subCategory|| '',
                status: stock ? true : false,
                thumbnail: thumbnail || []
            };

            SelectedInventory.inventory.items.push(newProduct);

            await SelectedInventory.inventory.save();

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
    //OK - Testeado ✅
    async getItems(props) {
        try {
            const { email, inventoryName, available, category, alfabetic } = props;
            const selectedInventory = await this.getInventory(email, inventoryName);

            if(!selectedInventory.status){
                return {
                    error: selectedInventory.error,
                    message: selectedInventory.message,
                    status: false
                };
            }

            // Acceder a la propiedad _doc y remover los atributos '_id', 'createdAt', y 'updatedAt'
            const clearItems = selectedInventory.inventory.items.map(item => {
                // eslint-disable-next-line no-unused-vars
                const { _id, createdAt, updatedAt, ...rest } = item._doc;
                return rest;
            });

            const response = {
                status: true,
                items: clearItems
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
    //OK - Testeado ✅
    async getAllInventories(email) {
        try {

            if (!email) {
                return {
                    error: 'Invalid request',
                    message: 'El usuario no fue enviado',
                    status: false
                };
            }

            const inventorys = await InventorytModel.find({ email: email });

            if (!inventorys) {
                return {
                    error: 'Invalid request',
                    message: 'No se encontraron inventarios',
                    status: false
                };
            }
            return {
                status: true,
                inventory: inventorys
            };
            
        } catch (error) {
            console.log("Error al buscar inventarios", error);
            errorHanlder.controllerError('ProductManager - getAllInventories', error);
        }
    }
    //OK - Testado ✅
    async getItemByCode(props) {
        try {
            const { email, inventoryName, code } = props;
            const selectedInventory = await this.getInventory(email, inventoryName);

            if(!selectedInventory.status){
                return {
                    error: selectedInventory.error,
                    message: selectedInventory.message,
                    status: false
                };
            }

            const item = selectedInventory.inventory.items.find(product => product.code === code);

            if (!item) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto no existe',
                    status: false
                };
            }
            // eslint-disable-next-line no-unused-vars
            const { _id, createdAt, updatedAt, ...clearItem } = item._doc;
            return {
                status: true,
                product: clearItem
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
    //OK - Testeado ✅
    async updateProduct(props) {
        try {
            const { email, inventoryName, name, description, price, code, stock, category, subCategory, thumbnail } = props;
            const updateData = { name, description, price, stock, category, subCategory, thumbnail };
            const SelectedInventory = await this.getInventory(email, inventoryName);
    
            if (!SelectedInventory.status) {
                return {
                    error: SelectedInventory.error,
                    message: SelectedInventory.message,
                    status: false
                };
            }
    
            const item = SelectedInventory.inventory.items.find(product => product.code === code);
    
            if (!item) {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto no existe',
                    status: false
                };
            }
    
            // Actualizar solo los campos que se proporcionan en updateData y dejar el resto sin cambios
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined) {
                    item[key] = updateData[key];
                }
            });
    
            await SelectedInventory.inventory.save();
    
            return {
                status: true,
                item: item.toObject() // Devuelve el objeto actualizado
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
    //Revisar - Testeado ✅
    async deleteProduct(props) {
        try {
            const { email, inventoryName, code } = props;
            const SelectedInventory = await this.getInventory(email, inventoryName);
    
            if (!SelectedInventory.status) {
                return {
                    error: SelectedInventory.error,
                    message: SelectedInventory.message,
                    status: false
                };
            }
    
            const index = SelectedInventory.inventory.items.findIndex(item => item.code === code);
            if (index !== -1) {
                SelectedInventory.inventory.items.splice(index, 1);
            }else {
                return {
                    error: 'Invalid request',
                    message: 'El código de producto no existe',
                    status: false
                };
            }
            
            await SelectedInventory.inventory.save();
            console.log(SelectedInventory.inventory);
            return {
                status: true
            };
            
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