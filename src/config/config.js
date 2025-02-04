const dotenv = require("dotenv"); 
const program = require("../utils/commander.js");

//Este módulo sirve para cargar variables de entorno de una manera mas sencilla
//  Si es necesario tranajar en desarrollo o producción

const { mode } = program.opts(); 

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
})

const configObject = {
    mongo_url: process.env.MONGO_URL
}

module.exports = configObject;