// necesarios para cada una de las validaciones
const Role = require('../models/role');
const Usuario = require('../models/usuario');


const isValidRole = async(role = '') => {
          
    const isExistRole = await Role.findOne( { role } );
    if ( !isExistRole ) {
      throw new Error(`El rol ${role} no está registrado en la BD`)
    }
}

const emailAlreadyExist = async( email = '' ) => {

    // validar si ya existe el  email
    const isExistingEmail = await Usuario.findOne({ email });
    if (isExistingEmail) {
          throw new Error(`Este email ${ email} ya fue registrado!`)
          // return response.status(400).json({
          //     msg: 'Este email ya fue registrado!'
          // });
    }

}


const idAlreadyExist = async( id = '' ) => {

  // validar si ya existe el  email
  const isExistingId = await Usuario.findById(id);
  if ( !isExistingId ) {
        throw new Error(`Este ID ${ id} no existe!`)
  }

}

module.exports = {
  isValidRole,
  emailAlreadyExist,
  idAlreadyExist
}