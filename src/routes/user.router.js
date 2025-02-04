//Librerias
const express = require("express");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
//Modelos
const UserModel = require("../models/users.model.js");
//Handlers
const errorHandler = require("../utils/validatorHandler.js");
const UsersManager = require("../controllers/usersManager.controller.js");
const usersManager = new UsersManager();

//Register - OK
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        
        const newUser = await usersManager.registerUser({ name, email, password });

        if(!newUser.status) { 
            return res.status(400).json({ error: newUser.error, message: newUser.message });
        }

        // Almacenar información del usuario en la sesión
        req.session.login = true;
        req.session.user = { ...newUser.user._doc };

        return res.status(200).json({ message: "Usuario creado con éxito" });

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al registrar el usuario'
        });
    }

})

//Login - OK
router.post("/login", async (req, res) => {
    const {email, password} = req.body; 

    try {
        //El controlador hace las validaciones necesarias y retorna un objeto con el usuario o un error
        const user = await usersManager.loginUser(email, password);

        if (!user.status) {
            return res.status(400).json({ error: user.error, message: user.message });
        }

        //Tanto en la cookie como en el token, se debería utilizar una variable de entorno
        //    en este caso no se utiliza por simplicidad
        const token = jwt.sign(
            { 
                usuario: user.user.usuario, 
                rol: user.user.rol 
            }, 
            "inventaryCookieToken",
            { expiresIn: '12h' }
        );

        return res.status(200).cookie("inventaryCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: true });

    } catch (error) {
        console.error("Error al loguear el usuario:", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al loguear el usuario'
        });
    }
})

//User
router.get("/:uid", async (req, res) => {
    
    try {

        const userID = await req.params.uid;

        errorHandler.numeric(userID);

        if (errorHandler.code !== 0) {

            return res.status(400).json({ERROR:errorHandler});
        } else {

            return res.status(200).json({mensaje:"El ID enviado es valido"});
        }
        
       
        
    } catch (error) {
        res.status(500).send("Error interno del servidor: " + error);
    }
    
})

//Logout: 
router.post("/logout", (req, res) => {
    //Voy a limpiar la cookie del Token
    res.clearCookie("inventaryCookieToken"); 
    
    return res.status(200).json({mensaje: "Sesión cerrada con éxito"});
})

//Rutas Admin: 

//login Admin:
router.post("/loginAdmin", async (req, res) => {
    const {usuario, password} = req.body; 

    try {
        //El controlador hace las validaciones necesarias y retorna un objeto con el usuario o un error
        const user = await usersManager.loginUser(usuario, password);

        if (!user.status) {
            return res.status(400).json({ error: user.error, message: user.message });
        }

        if (user.rol !== "admin") {
            return res.status(403).send("Acceso Denegado");
        }

        //Tanto en la cookie como en el token, se debería utilizar una variable de entorno
        //    en este caso no se utiliza por simplicidad
        const token = jwt.sign(
            { 
                usuario: user.user.usuario, 
                rol: user.user.rol 
            }, 
            "inventaryCookieToken",
            { expiresIn: '12h' }
        );

        res.cookie("inventaryCookieToken", token, { maxAge: 3600000, httpOnly: true, secure: true });

    } catch (error) {
        console.error("Error al loguear el usuario:", error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Hubo un problema al loguear el usuario'
        });
    }
})

//Ver usuarios:
router.get("/getUsers", passport.authenticate("jwt", {session: false}), (req, res) => {
    console.log(req.user);
    if ( req.user.rol !== "admin") {
        return res.status(403).send("Acceso Denegado");
    }
    //Si el usuario es admin, mostrar el panel correspondiente: 
    res.render("admin");
})



module.exports = router;