const { request, response } = require("express");


const isAdminRole = (req= request, res = response, next ) => {

  if ( !req.authInfo ) {
      return res.status(500).json({
          msg: 'Se quiere validar el rol sin validar el token primero'
        });
      }
      
      const { role, nombre } = req.authInfo;
      
      if ( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
          msg: `Acción Denegada: 
          La cuenta ${nombre} no tiene alguno de estos roles: Administrador, desarrollador o propietario`
        });
      }
      
      next();
      
}

const haveRole = ( ... roles ) => {

  return ( req, res = response, next) => {

    console.log('VALIDATE_ROLE:', roles);
    
    if ( !req.authInfo ) {
      return res.status(500).json({
        msg: 'Se quiere validar el rol sin validar el token primero'
          });
    }

    if ( !roles.includes( req.authInfo.role ) ) {
      return res.status(401).json({
        msg: `El servicio requiere alguno de estos roles: ${roles}`
      });
    }

    }

  next();

}


module.exports = {
  isAdminRole,
  haveRole
}