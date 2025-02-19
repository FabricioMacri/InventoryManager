
//Error Hanlder:
const ErrorHanlder = require('../utils/validatorHandler.js');
const errorHanlder = new ErrorHanlder();

//Models:
const InventorytModel = require("../models/inventorys.model.js");

class ProductManager {

    //OK - Testeado ✅ - DOCUMENTADO ❌
    async getInventory(email, name) {

        try {

            if (!email || !name) {
                return {
                    code: 400,
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
                    code: 404,
                    error: 'Not Found',
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
    //OK - Testeado ✅ - DOCUMENTADO ✅
    async newInventory(email, name) {
        try {

            if (!email || !name) {
                return {
                    code: 400,
                    error: 'Bad Request',
                    message: 'El usuario o el nombre del inventario no fueron enviados',
                    status: false
                };
            }

            const inventory = await this.getInventory(email, name);

            if (inventory.status) {
                return {
                    code: 409,
                    error: 'Conflict',
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
    //OK - Testeado ✅ - DOCUMENTADO ✅
    async addItems(props) {
        try {
            const { email, inventoryName, list } = props;

            const SelectedInventory = await this.getInventory(email, inventoryName);
            if(!SelectedInventory.status){
                return {
                    code: SelectedInventory.code,
                    error: SelectedInventory.error,
                    message: SelectedInventory.message,
                    status: false
                };
            }

            //Reviso que no haya ningun tipo de error en la lista antes de agregarla
            const listHandler = {
                error: '',
                message: '',
                status: true
            }
            list.forEach(item => {
                if (!item.name || !item.price || !item.code || !item.category) {
                    listHandler.error = "Invalid request";
                    listHandler.message = "La lista enviada tiene items con campos obligatorios vacios.";
                    listHandler.status = false;
                }
                const flag = SelectedInventory.inventory.items.some(el => el.code === item.code);
                if(flag){
                    listHandler.error = 'Invalid request';
                    listHandler.message = `El código: ${item.code} ya existe, la lista no se agregara al inventario.`;
                    listHandler.status = false;
                }
            });
            if(!listHandler.status){ return listHandler }

            list.forEach(async item => {
                
                const newProduct = {
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    code: item.code,
                    stock: item.stock|| 0,
                    category: item.category,
                    subCategory: item.subCategory|| '',
                    status: item.stock ? true : false,
                    thumbnail: item.thumbnail || []
                };

                SelectedInventory.inventory.items.push(newProduct);
            });
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
    //OK - Testeado ✅ - DOCUMENTADO ❌
    async getItems(props) {
        try {
            const { 
                email, inventoryName, available, category, alfabetic, 
                stock, expensive, search, stockList, priceRange
            } = props;
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

            const sortByCategory = () => {
                const categorizedItems = clearItems.reduce((acc, item) => {
                  const category = item.category;
                  if (!acc[category]) {
                    acc[category] = [];
                  }
                  acc[category].push(item);
                  return acc;
                }, {});
              
                return Object.keys(categorizedItems).map(category => ({
                  name: category,
                  items: categorizedItems[category]
                }));
              };
            if (available) {
                const availableItems = clearItems.filter(item => item.status === true);
                response.items = availableItems;
            }
            if (category) {
                response.items = sortByCategory();
            }
            if (alfabetic) {
                const alfabeticItems = clearItems.sort((a, b) => a.name.localeCompare(b.name));
                response.items = alfabeticItems;
            }
            if(stock && stock > 0) {
                const availableItems = clearItems.filter(item => item.stock > stock);
                response.items = availableItems;
            }
            if(expensive) {
                response.items = sortByCategory().map(sublist => {
                    if (Array.isArray(sublist)) {
                      return sublist.sort((a, b) => b.price - a.price);
                    }
                });
            }
            if(stockList) {
                response.items = sortByCategory().map(sublist => {
                    if (Array.isArray(sublist.items)) {
                      return sublist.items.map(product => ({
                        name: product.name,
                        stock: product.stock
                      }));
                    } else {
                      return [];
                    }
                  });
                  
            }
            if(priceRange) {
                response.items = clearItems.filter(
                    product => product.price >= priceRange.min && product.price <= priceRange.max
                );
            }
            if(search){
                response.items = clearItems.filter(
                    product => product.name.toLowerCase().includes(search)
                )
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
    //OK - Testeado ✅ - DOCUMENTADO ❌
    async getAllInventories(email) {
        try {

            if (!email) {
                return {
                    code: 400,
                    error: 'Invalid request',
                    message: 'El usuario no fue enviado',
                    status: false
                };
            }

            const inventorys = await InventorytModel.find({ email: email });

            if (!inventorys) {
                return {
                    code: 404,
                    error: 'Not Found',
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
            return {
                code: 500,
                error: 'Internal server error',
                message: 'Hubo un problema al obtener el inventario.',
                status: false
            };
        }
    }
    //OK - Testeado ✅ - DOCUMENTADO ❌
    async deleteAllInventories(email) {
        if(!email) return {
            code: 400,
            error: 'Invalid request',
            message: 'Uno o más de los campos obligatorios no fue enviado',
            status: false
        };

        const inventoriesList = await InventorytModel.deleteMany({email:email});

        return { status:true, inventories: inventoriesList}
    }
    //OK - Testeado ✅ - DOCUMENTADO ❌
    async deletInventory(email, name) {
        if(!email || !name) return {
            code: 400,
            error: 'Invalid request',
            message: 'Uno o más de los campos obligatorios no fue enviado',
            status: false
        };

        const inventory = await this.getInventory(email, name);

        if (inventory) {
            const result = await InventorytModel.deleteOne({ _id: inventory._id });
            return { status: true, user: result };
        } else {
            return {
                code: inventory.code,
                error: inventory.error,
                message: inventory.message,
                status: false
            };
        }

    }
    //OK - Testado ✅ - DOCUMENTADO ❌
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
    //OK - Testeado ✅ - DOCUMENTADO ❌
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
    //Revisar - Testeado ✅ - DOCUMENTADO ❌
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