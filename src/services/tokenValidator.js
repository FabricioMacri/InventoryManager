const jwt = require('jsonwebtoken');

// Middleware para validar el JWT
function validateJWT(token) {
    try {
        //Importo mi codigo de seguridad desde la variable de entorno
        const secretKey = process.env.SECRET_KEY;
        if(!token) {
            return {
                error: 'Invalid token',
                message: 'Token no enviado',
                status: false
            }
        }
        const decoded = jwt.verify(token, secretKey);

        if(decoded.iat) return { status: true };
    } catch (error) {
        console.log(error);
        return {
            error: 'Invalid token',
            message: 'El token es inválido',
            status: false
        };
    }
}

module.exports = validateJWT;