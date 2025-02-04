const jwt = require('passport-jwt');
const passport = require('passport');

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

//En este módulo se utiliza json web token como estrategia de autenticación por medio de passport
//  y enviando una cookie con el token

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "167349197346285"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["inventoryCookie"];
    }
    return token;
}

module.exports = initializePassport;
