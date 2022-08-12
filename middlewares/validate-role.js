const { request, response } = require("express");


const haveAdminRole = (req= request, res = response, next ) => {

  if ( !req.authInfo ) {
      return res.status(500).json({
          msg: 'Se quiere validar el rol sin validar el token primero'
      });
  }

  const { role, nombre } = req.authInfo;

  if ( role !== 'ADMIN_ROLE') {
      return res.status(401).json({
          msg: `Acción Denegado: La cuenta de ${nombre} no tiene rol de administrador`
      });
  }

  next();

}

module.exports = {
  haveAdminRole
}