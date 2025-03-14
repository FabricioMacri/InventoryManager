const express = require('express');
const router = express.Router();

//Controllers
const inventoryManager = require('../controllers/inventoryManager.controller.js');
const InventoryManager = new inventoryManager();

//Utils
const errorHandler = require('../utils/validatorHandler.js');
const errorHanlder = new errorHandler();
const JWTValidator = require("../services/tokenValidator.js");

//RUTAS:

//Nuevo inventario - Testeado ✅ - DOCUMENTADO ✅
router.post('/newInventory', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        const { email, name } = req.body;

        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const newInventory = await InventoryManager.newInventory(email, name);

        if(!newInventory.status) {
            return res.status(newInventory.code).json({ error: newInventory.error, message: newInventory.message });
        }

        return res.status(200).json({ message: 'Inventario creado con éxito' });

    } catch (error) {
        console.error("Error al crear el inventario:", error);
        errorHanlder.controllerError('Inventorys Router - /newInventory', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al crear el inventario'
        });
    }
});
//Obtener todos los inventarios - Testeado ✅ - DOCUMENTADO ✅ 
router.post('/getInventorys', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        const { email } = req.body;

        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(decoded.code).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const inventory = await InventoryManager.getAllInventories(email);

        if(!inventory.status) {
            return res.status(inventory.code).json({ error: inventory.error, message: inventory.message });
        }

        return res.status(200).json({ inventory });

    } catch (error) {
        console.error("Error al buscar el inventario:", error);
        errorHanlder.controllerError('Inventorys Router - /getInventorys', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al buscar el inventario'
        });
    }
});
//Eliminar inventario - Testeado ✅ - DOCUMENTADO ✅ 
router.delete('/deleteInventory', async (req, res) => {
    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        const { email, name } = req.body;

        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(decoded.code).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const deletedInventory = await InventoryManager.deleteInventory(email, name);

        if(!deletedInventory.status) {
            return res.status(deletedInventory.code).json({ error: deletedInventory.error, message: deletedInventory.message });
        }

        return res.status(200).json({ message: 'Inventario eliminado con éxito' });

    } catch (error) {
        console.error("Error al eliminar el inventario:", error);
        errorHanlder.controllerError('Inventorys Router - /deleteInventory', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al eliminar el inventario'
        });
    }
});
//Agregar item - Testeado ✅ - DOCUMENTADO ✅
router.post('/addItems', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }

        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }
        
        const newProduct = await InventoryManager.addItems(req.body);

        if(!newProduct.status) {
            return res.status(newProduct.code).json({ error: newProduct.error, message: newProduct.message });
        }

        return res.status(200).json({ message: 'Producto registrado con éxito' });

    } catch (error) {
        console.error("Error al crear el producto:", error);
        errorHanlder.controllerError('Inventorys Router - /addProduct', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al registrar el producto'
        });
    }
});
//Obtener inventario - Testeado ✅ - DOCUMENTADO ✅
router.post('/getItems', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const inventory = await InventoryManager.getItems(req.body);

        if(!inventory.status) {
            return res.status(400).json({ error: inventory.error, message: inventory.message });
        }

        return res.status(200).json({ inventory });

    } catch (error) {
        console.error("Error al obtener el inventario:", error);
        errorHanlder.controllerError('Inventorys Router - /getItems', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al obtener el inventario'
        });
    }
});
//Obtener item por ID - Testeado ✅ - DOCUMENTADO ✅ 
router.post('/getItemByCode', async (req, res) => {
    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const item = await InventoryManager.getItemByCode(req.body);

        if(!item.status) {
            return res.status(400).json({ error: item.error, message: item.message });
        }

        return res.status(200).json({ item });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        errorHanlder.controllerError('Inventorys Router - /getItemByCode', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al obtener el producto'
        });
    }
});
//Actualizar item - Testeado ✅ - DOCUMENTADO ✅ 
router.put('/updateItem', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const update = req.body.code ? 
        await InventoryManager.updateItemByCode(req.body) : await InventoryManager.updateInventory(req.body);

        if(!update.status) {
            return res.status(400).json({ error: update.error, message: update.message });
        }

        return res.status(200).json({ message: 'Producto actualizado con éxito', update });

    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        errorHanlder.controllerError('Inventorys Router - /updateProduct', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al actualizar el producto'
        });
    }
});
//Eliminar item Testeado ✅ - DOCUMENTADO ✅ 
router.delete('/deleteItem', async (req, res) => {
    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        if(!req.headers.authorization){
            return res.status(401).json({ error: "Unauthorized", message: "No autorizado" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const deletedProduct = await InventoryManager.deleteItem(req.body);

        if(!deletedProduct.status) {
            return res.status(400).json({ error: deletedProduct.error, message: deletedProduct.message });
        }

        return res.status(200).json({ message: 'Producto eliminado con éxito' });

    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        errorHanlder.controllerError('Inventorys Router - /deleteProduct', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al eliminar el producto'
        });
    }
});

module.exports = router;