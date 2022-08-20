// todo el código es nuevo para cubrir la seccion: 10

const { response, json, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

// const createJWT = require('../helpers/generate-jwt');
const usuario = require("../models/usuario");
const { createJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req = request, res = response) => {

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

const googleSignIn = async(req = request, res = response) => {

    const { id_token } = req.body;

    try {

        // first way to obtain user info
        // const googleUser = await googleVerify( id_token );
        // console.log(googleUser);
        
        // second way ...
        const { name, picture, email } = await googleVerify( id_token );
        console.log(`\n-- logged user info --\n Name...: ${name}\n URL img: ${picture}\n Email..: ${email}`);

        // verify user in DB
        console.log('>>> it will be verified:', email);



        let logInUser = await Usuario.findOne( {email} );

        console.log('>>> Search account in database: ', logInUser)

        
        if ( !logInUser || logInUser === null ) {
            
            // create user
            const data =  {
                nombre: name,
                email, 
                password: ':P',
                img: picture,
                google: true,
                status: true,
                role: ':)'
            };
    

            logInUser = new Usuario( data );
            console.log('New account successfully created '+logInUser)
            await logInUser.save();
        }

        // check if the user is active (status)
        if ( !logInUser.status ) {
                return res.status(401).json({
                    msg: 'Hable con el administrador. Usuario no activo/bloqueado'
                });
        }

        // generate el JWT
        const token = await createJWT(logInUser.id);

        res.json({
                msg: 'Login was successful',
                logInUser,
                token
        });
        
    } catch (error) {
        res.status(400).json({
                ok: false,
                msg: 'No se pude verificar el Token',
        })

    }

}


module.exports = {
  login,
  googleSignIn
}