// Imports:
const express = require('express');
const exphbs = require("express-handlebars");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require("express-session");

//Import modules: 
const clientRouter = require('./routes/inventorys.router.js');
const usersRouter = require('./routes/user.router.js');

// Server, puerto y conexion a la BD
const app = express();
const PUERTO = 8080;
require("./database.js");

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
}))

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// Routes
app.post("/testing", (req, res) => {
    try {

        const JWTValidator = require("./services/tokenValidator.js");
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWTValidator(token);
        console.log("Decoded", decoded);
        if(!decoded.status) {
            return res.status(400).json({ error: decoded.error, message: decoded.message });
        }

        return res.status(200).json({ message: "Token válido", user: decoded });
    } catch (error) {
        console.log("Error en la ruta testing", error);
        return res.status(500).send("Internal server error");
    }
});
app.use("/client", clientRouter);
app.use("/users", usersRouter);

// Listener
app.listen(PUERTO, () => {

    console.log('Escuchando puerto: ' + PUERTO);
})
