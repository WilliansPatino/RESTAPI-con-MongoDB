const { request, response } = require("express");


const isAdminRole = (req = request, res = response, next ) => {

      if ( !req.authInfo ) {
        return res.status(500).json({
            msg: 'Intenta validar el rol antes de validar el token'
          });
        }
        
        const { role, nombre } = req.authInfo;
        
        if ( role !== 'ADMIN_ROLE') {
          return res.status(401).json({
            msg: `La cuenta no tiene ninguno de estos roles: administrador, desarrollador o propietario`
          });
        }
        
        next();
        
      }
      
      const haveRole = ( ... roles ) => {
        
        return ( req = request, res = response, next) => {
          
          console.log('VALIDATE_ROLE:', roles);
          
          if ( !req.authInfo ) {
            return res.status(500).json({
              msg: 'Intenta validar el rol antes de validar el token'
          });
    }


    if ( !roles.includes(req.authInfo.role) ) {
      return res.status(401).json({
        msg: `la solicitud requiere uno de estos roles: ${roles}`
      });
    }

    next();
    
    }

    
  }


module.exports = {
  isAdminRole,
  haveRole
}