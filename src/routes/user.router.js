//Librerias
const express = require("express");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
//Handlers
const errorHandler = require("../utils/validatorHandler.js");
const UsersManager = require("../controllers/usersManager.controller.js");
const usersManager = new UsersManager();

//Rutas user:

//Register - Testeado ✅
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
                usuario: newUser.user.usuario, 
                rol: newUser.user.rol 
            }, 
            mi_key,
            { expiresIn: '12h' }
        );

        const clearUser = {
            name: newUser.user.name, 
            email: newUser.user.email,
            token
        };

        return res.status(200).json({ clearUser });
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
//Login - Testeado ✅
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        //El controlador hace las validaciones necesarias y retorna un objeto con el usuario o un error
        const user = await usersManager.loginUser({email, password, user: "user"});

        if (!user.status) {
            return res.status(400).json({ error: user.error, message: user.message });
        }

        const mi_key = process.env.SECRET_KEY;

        const token = jwt.sign(
            { 
                usuario: user.user.usuario, 
                rol: user.user.role
            }, 
            mi_key,
            { expiresIn: '12h' }
        );

        const clearUser = {
            name: user.user.name, 
            email: user.user.email,
            token
        };

        return res.status(200).json({ clearUser });
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
//Logout - haciendo 🔨
router.post("/logout", (req, res) => {
    //Voy a limpiar la cookie del Token
    res.clearCookie("inventaryCookieToken"); 
    
    return res.status(200).json({mensaje: "Sesión cerrada con éxito"});
})

//Rutas Admin: 

//login Admin: haciendo 🔨
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
//Ver usuarios: haciendo 🔨
router.get("/getUsers", passport.authenticate("jwt", {session: false}), (req, res) => {
    console.log(req.user);
    if ( req.user.rol !== "admin") {
        return res.status(403).send("Acceso Denegado");
    }
    //Si el usuario es admin, mostrar el panel correspondiente: 
    res.render("admin");
})



module.exports = router;