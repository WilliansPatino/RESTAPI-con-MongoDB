const jwt = require('jsonwebtoken');
const { response, request } = require('express');

// to get info about authenticated account :: secc: 10
const Usuario = require('../models/usuario');



const validateJWT = async (req = request, res = response, next ) => {

    // leer headers
    const tokenReceived = req.header('x-token')

    // console.log('TOKEN received:', tokenReceived); // only for monitoring

    if ( !tokenReceived ) {
        return res.status(401).json({
            msg: 'Token no fue recibido en la petición'
        });
    }

    // validar el token recibido
    try {

        // authorized account uid
        const { uid } = jwt.verify( tokenReceived, process.env.PRIVATEORSECRETKEY );
        
        // get the info account corresponding to the Authenticated UID
        const authorizedAccount = await Usuario.findById ( uid );
        
        // validate authorized account
        if ( !authorizedAccount ) { // not found in DB
                return res.status(401).json({
                        msg: "Token no autorizado - Cuenta no existe en la BD "
                })
        }
        
        
        // Verificar si la cuenta autenticada tiene el status de activa
        if ( !authorizedAccount.status) {
            return res.status(401).json({
                msg: 'Token no autorizado - Cuenta eliminada'
            })
        }
        
        req.authInfo = authorizedAccount;
        
       next();

    } catch (error) {

          console.log(error);
          res.status(401).json({
              msg: 'Su sessión ha caducado o Token inválido!'
          })
    }

}


module.exports = {
  validateJWT
}