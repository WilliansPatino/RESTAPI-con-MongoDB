

/// modelo de datos de la BD
/* {
  nombre: 'user',
  email: 'user@domain'
  password: 'encriptado',
  img: '',          // URL
  role: '',
  status: false,   // true = Creado/activo , false = Eliminado
  google: false    // Se utiliza autenticación de Google
} */

const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
      type: String,
      required: [true, '* Nombre es Requerido']
    },
    email: {
      type: String,
      required: [true, '* Email Requerido'],
      unique: true
    },
    password: {
      type: String,
      required: [true, '* Requerido']
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ['ADMIN_ROLE','USER_ROLE']
    },
    status: {
      type: Boolean,
      default: true
    },
    google: {
      type: Boolean,
      default: false
    }

});

// Es obligatorio declarar una funcion normal, a fin de usar 
// el sobreescribir el objeto y destructurarlo y excluir los 
// campos que se desea 'no mostrar' en la respuesta
// una instancia 
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ... public_data  } = this.toObject();
    //    { --v, password, _id, ...}  datos a excluir de ser mostrado :: Seccion: 10

    // Se transforma el _id para mostrar como uid  (seccion: 10)
    public_data.uid = _id;

    return public_data;
}

module.exports = model('Usuario', UsuarioSchema);