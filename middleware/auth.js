'use strict';
const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const jwtToken = req.header('Authorization');
    if(!jwtToken) return res.status(400).send('Acceso denegado. Se necesita un token valido');
    try{
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_CAR_API);
        req.user = payload;
        next();
    }catch(e){
        res.status(400).send('Acceso denegado. Token no valido');
    }
}

module.exports = auth;