const jwt = require('jsonwebtoken');

// Middleware para validar el JWT
function validateJWT(token) {
    try {
        //Importo mi codigo de seguridad desde la variable de entorno
        const secretKey = process.env.SECRET_KEY;
        if(!token) {
            return {
                code: 401,
                error: 'Unauthorized',
                message: 'Invalid token',
                status: false
            }
        }
        const decoded = jwt.verify(token, secretKey);

        if(decoded.iat) return { status: true, data: decoded };
    } catch (error) {
        console.log(error);
        return {
            code: 401,
            error: 'Unauthorized',
            message: 'Invalid token',
            status: false
        };
    }
}

module.exports = validateJWT;