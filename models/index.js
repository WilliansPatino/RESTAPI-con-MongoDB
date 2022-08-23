// Se agrupan todos los modelos creados a fin de simplificar
// la codificación

const Category  = require('./category');
const Role      = require('./role');
const Server    = require('./Server');
const Usuario   = require('./usuario');

module.exports = {

  Category,
  Role,
  Server,
  Usuario,
}