// todo el código es nuevo para cubrir la seccion: 10

const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

// const createJWT = require('../helpers/generate-jwt');
const usuario = require("../models/usuario");
const { createJWT } = require("../helpers/generate-jwt");


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // verificar si existe el email
        const accountToVerify = await Usuario.findOne( { email } );
        

        if ( !accountToVerify ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son válidos (email)'
            });
        }

        // Verificar si el usuario esta activo
        if ( !accountToVerify.status ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son válidos (No activo)'
            });
        }

        // Verificar la contraseña
        const isValidPassword = 
          bcryptjs.compareSync( password, accountToVerify.password);
        if ( ! isValidPassword ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son válidos (pass)'
            });
        }

        // Generar el JWT
        const token = await createJWT(accountToVerify.id);

        console.log('Auth login verified:', accountToVerify.id);
        // console.log('TOKEN Generated:', token);
        
      res.json({
        msg: 'Login successful',
        accountToVerify,
        token
      })
      
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el Administrador de sistema'
        })
    }

}

module.exports = {
  login
}