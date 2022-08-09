const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');  // El standard sugiere
                                               // iniciar con Mayuscula esta
                                               // variable.-

// encriptar el password
function encryptPassword( pass ) {
  const salt = bcryptjs.genSaltSync();
  ep = bcryptjs.hashSync(pass, salt);
  return ep;
}

const usuariosGet = async(request, response) => {

    const { limite = 5, desde = 0 } = request.query;

    // solo los que no han sido eliminados
    const notDeleted = { status: true };


    // Se resolvera ambas/todas las promesas, ejecutandose de manera simultanea
    const [ total, users ] = await Promise.all([
      Usuario.countDocuments(notDeleted),
          Usuario.find(notDeleted)            // solo activos
            .skip(Number(desde))              //  desde que registro comenzar
            .limit(Number(limite))           // # de items a mostrar
    ]);
    

    response.json({ 
        total,
        users
    
    });
}

const usuariosPost = async(req, response) => {


  // Extraer el body
  const { nombre, email, password, role } = req.body;    


  // Se deestructura los campos  para validar y registra solo lo deseado
  const usuario = new Usuario( { nombre, email, password, role } );  
  
  usuario.password = encryptPassword(password);
  

  // Guardar el registro en la BD
  await usuario.save();

  response.json({ 
      // msg: 'API Post - controlador',
      usuario
   
  });
  /* #  Los desarrolladores de Backend, no deben confiar en el 
  desarrolladores Front-end y validar todos los endpoints de 
  manera minuciosa posible. */
}

const usuariosPut = async(request, response) => {

    const { id }  = request.params;

    // ***** Se excluyen para evitar que sean modificados ***********
    //        id, password, google, status y el email 
    const {_id,  password, google, status, email,  ... restoData } = request.body;
    // Para mantener la integridad referencial con autenticación basada en GMAIL
    // se excluye la modificación del email.


    // validar ID contra la BD
    if ( password ) {
        // encryptPassword(restoData);
        // const salt = bcryptjs.genSaltSync();
        // restoData.password = bcryptjs.hashSync(password, salt);
        restoData.password = encryptPassword(password);
    }

    // User data
    const user = await Usuario.findByIdAndUpdate( id, restoData );

  response.json({ 
      // msg: 'API Put Actualizado',
      user
  });
}

const usuariosPatch = (request, response) => {

  response.json({ 
      msg: 'API Patch  - controlador'
  });
}

const usuariosDelete = async(request, response) => {

    const { id }  = request.params;

    // ********* Borrado físico de un registro en la BD **********
    // const usuario = await Usuario.findByIdAndDelete( id );
    // ----- Nota: 
    //  Se recomienda no usar este método de eliminar registros, dado que
    //  si este usuario tiene asociados otros registros/cambios, entonces
    //  se perdería la INTEGRIDAD REFERENCIAL

    // Cambiar el status del registro para indicar que fue eliminado
    const user_delete = await Usuario.findByIdAndUpdate( id, { status: false} );

    response.json({ 
        // msg: 'API Delete  - controlador'
        user_delete
    });
}



module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}