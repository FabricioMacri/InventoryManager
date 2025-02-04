// Imports:
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require("express-handlebars");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require("express-session");

//Import modules: 
const clientRouter = require('./routes/client.router.js');
const adminRouter = require('./routes/admin.router.js');

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
app.use("/client", clientRouter);
app.use("/admin", adminRouter);

// Listener
const httpServer = app.listen(PUERTO, () => {

    console.log('Escuchando puerto: ' + PUERTO);
})
