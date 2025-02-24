//Librerias
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
//Handlers
const ErrorHandler = require("../utils/validatorHandler.js");
const errorHandler = new ErrorHandler();

const UsersManager = require("../controllers/usersManager.controller.js");
const usersManager = new UsersManager();

const InventoryManager = require('../controllers/inventoryManager.controller.js');
const inventoryManager = new InventoryManager();

//Rutas user:

//Register - Testeado ✅ - DOCUMENTADO ✅
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        
        const newUser = await usersManager.registerUser({ name, email, password });

        if(!newUser.status) { 
            return res.status(400).json({ error: newUser.error, message: newUser.message });
        }

        const mi_key = process.env.SECRET_KEY;

        const token = jwt.sign(
            { 
                email: newUser.user.usuario
            }, 
            mi_key,
            { expiresIn: '12h' }
        );

        return res.status(200).json({ 
            name: newUser.user.name, 
            email: newUser.user.email,
            token 
        });
        /* Si esta API estuviera directamente conectada a un front-end, se podría utilizar una cookie,
            en este caso se utiliza una respuesta JSON porque es un API de prueba

        return res.status(200).cookie(
            "inventaryCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: true }
        );
        
        */
    
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        errorHandler.routerError("POST /register", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al registrar el usuario'
        });
    }

})
//Login - Testeado ✅ - DOCUMENTADO ✅
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        //El controlador hace las validaciones necesarias y retorna un objeto con el usuario o un error
        const user = await usersManager.loginUser({email, password, role: "user"});

        if (!user.status) {
            return res.status(400).json({ error: user.error, message: user.message });
        }

        const mi_key = process.env.SECRET_KEY;

        const token = jwt.sign(
            { 
                email: user.user.email
            }, 
            mi_key,
            { expiresIn: '12h' }
        );

        return res.status(200).json({ 
            name: user.user.name, 
            email: user.user.email,
            token 
        });
        //return res.status(200).cookie(mi_key, token, { maxAge: 3600000, httpOnly: true, secure: true });

    } catch (error) {
        console.error("Error al loguear el usuario:", error);
        errorHandler.routerError("POST /login", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al loguear el usuario'
        });
    }
})

//Rutas Admin: 

//login Admin: Testeado ✅
router.post("/loginAdmin", async (req, res) => {
    const {email, password} = req.body; 

    try {
        //El controlador hace las validaciones necesarias y retorna un objeto con el usuario o un error
        const user = await usersManager.loginUser({email, password, role: "admin"});

        if (!user.status) {
            return res.status(400).json({ error: user.error, message: user.message });
        }
        if (user.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado" });
        }

        const clearUser = {
            name: user.user.name, 
            email: user.user.email,
            role: user.user.role
        };

        //Autenticamos con sessions
        req.session.login = true;
        req.session.user = clearUser;

        return res.status(200).json({ message: "Usuario admin logueado con éxito" }); 

    } catch (error) {
        console.error("Error al loguear el usuario:", error);
        errorHandler.routerError("POST /loginAdmin", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al loguear el usuario'
        });
    }
})
//Logout: Testeado ✅
router.post("/logout", (req, res) => {
    
    req.session.destroy();
    
    return res.status(200).json({mensaje: "Sesión cerrada con éxito"});
})
//Ver usuarios: Testeado ✅
router.post("/getUsers", async (req, res) => {
    try {
        if(!req.session.login) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado" });
        }
        const users = await usersManager.getUsers(req.body.email);

        if (!users.status) {
            return res.status(400).json({ error: users.error, message: users.message });
        }

        return res.status(200).json({ users: users.users });
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        errorHandler.routerError(" /getUsers", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al obtener los usuarios'
        });
    }
});
//Eliminar un usuario: Testeado ✅
router.post("/deleteUser", async (req, res) => {

    try {
        if(!req.session.login) {
            return res.status(403).json({ error: "Forbidden", message: "Acceso denegado" });
        }
        const result = await usersManager.deleteUser(req.body.email);

        if (!result.status) {
            return res.status(result.code).json({ error: result.error, message: result.message });
        }
        
        const inventorysList = await inventoryManager.deleteAllInventories(req.body.email);

        if(!inventorysList.status) {
            return res.status(inventorysList.code).json({ error: inventorysList.error, message: inventorysList.message });
        }

        return res.status(200).json({result, inventorysList});

    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        errorHandler.routerError("/deleteUser", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al eliminar el usuario'
        });
    }
})

module.exports = router;