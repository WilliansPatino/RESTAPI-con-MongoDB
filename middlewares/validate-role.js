const { request, response } = require("express");

const admin_roles = [ 
      'ADMIN_ROLE', 
      'DEVELOPER',
      'OWNER'
];

const isAdminRole = (req = request, res = response, next ) => {

      if ( !req.authInfo ) {
        return res.status(500).json({
            msg: 'Intenta validar el rol antes de validar el token'
          });
        }
        
        const { role, nombre } = req.authInfo;
        
        if ( !admin_roles.includes(role) ) {
        // if ( !role.includes('ADMIN_ROLE') ) {
          return res.status(401).json({
            msg: `La cuenta no tiene ninguno de estos roles:`,
            ADMIN_ROLE: 'Administrador',
            DEVELOPER: 'Desarrolladores',
            DIRECTOR: 'Director o Propietario'
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