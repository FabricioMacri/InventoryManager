const ErrorsModel = require("../models/errors.model.js");

//Esta clase ayuda a manejar los errores de la aplicacion y guardarlos en la base de datos 
//  para su posterior revisión.

class ValidatorHandler {

    /*
        code: Un codigo que ayuda a identidicar mas rapidamente de que tipo de error se trata
        type: El tipo de error que se genero
        location: En que parte de la aplicacion se genero el error para encotrarlo con mas facilidad
        message: El mensaje que se genero con el error
    */

    constructor() {

        this.code = 0;
        this.type = "No hay error";
        this.location = "";
        this.message = "El handler no encontro ningun error";
    }

    async errorLogs() {

        const newError = new ErrorsModel({

            code:this.code,
            type:this.type,
            location:this.location,
            message:this.message
        });
        newError.save();
    }

    async routerError(location, error) {

        this.code = 1;
        this.type = 'Hubo un error en un ROUTER';
        this.location = location;
        this.message = error;

        this.errorNotification();
    }

    async controllerError(location, error) {

        this.code = 2;
        this.type = 'Hubo un error en un CONTROLADOR';
        this.location = location;
        this.message = error;

        this.errorLogs();
    }

    async logicErrors(location, error) {

        this.code = 3;
        this.type = 'Hubo un error lógico';
        this.location = location;
        this.message = error;

        this.errorLogs();
    }
    
    async frontError(location, error) {

        this.code = 4;
        this.type = 'Hubo un error en el FRONT';
        this.location = location;
        this.message = String(error);

        this.errorLogs();
    }
}

module.exports = ValidatorHandler; 