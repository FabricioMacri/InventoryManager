const mongoose = require("mongoose"); 
const configObject = require("../config/config.js");

class BaseDatos {
    static #instancia; 
    constructor(){
        mongoose.connect(configObject.mongo_url);
    }

    static getInstancia() {
        if(this.#instancia) {
            console.log("Conexion previa");
            return this.#instancia;
        }

        this.#instancia = new BaseDatos(); 
        console.log("Base de datos conectada.");
        return this.#instancia;
    }
}


module.exports = BaseDatos.getInstancia();