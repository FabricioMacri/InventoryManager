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

//Nuevo inventario - Testeado ✅
router.post('/newInventory', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        const { email, name } = req.body;

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
            return res.status(400).json({ error: newInventory.error, message: newInventory.message });
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
//Obtener todos los inventarios - Testeado ✅
router.post('/getInventorys', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }
        const { email, name } = req.body;

        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const inventory = await InventoryManager.getAllInventories(email, name);

        if(!inventory.status) {
            return res.status(400).json({ error: inventory.error, message: inventory.message });
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
//Agregar item - Testeado ✅
router.post('/addItems', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
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
            return res.status(400).json({ error: newProduct.error, message: newProduct.message });
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
//Obtener inventario - Testeado ✅
router.post('/getItems', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
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
//Obtener item por ID - Testeado ✅
router.post('/getItemByCode', async (req, res) => {
    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
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
//Actualizar item - Testeado ✅
router.put('/updateItem', async (req, res) => {

    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }

        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const updatedProduct = await InventoryManager.updateProduct(req.body);

        if(!updatedProduct.status) {
            return res.status(400).json({ error: updatedProduct.error, message: updatedProduct.message });
        }

        return res.status(200).json({ message: 'Producto actualizado con éxito', updatedProduct });

    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        errorHanlder.controllerError('Inventorys Router - /updateProduct', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al actualizar el producto'
        });
    }
});
//Eliminar item Testeado ✅
router.delete('/deleteItem', async (req, res) => {
    try {
        if(!req.body.email) {
            return res.status(400).json({ error: "Bad request", message: "Faltan datos" });
        }

        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }
        if(decoded.data.email !== req.body.email) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado, el token no le pertenece a este usuario" });
        }

        const deletedProduct = await InventoryManager.deleteProduct(req.body);

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