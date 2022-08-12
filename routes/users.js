const { Router } = require('express');

// to validate fields
const { check } = require('express-validator');  

// const Role = require('../models/role');


const { usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete } = require('../controllers/usuarios');
  
  const router = Router();
  
  const { validateFields } = require('../middlewares/validate-fields');
  const { validateJWT } = require('../middlewares/validate-jwt');
  
  const { isValidRole, emailAlreadyExist, 
      idAlreadyExist } = require('../helpers/db-validators');


  
    // endpoints
    router.get('/', usuariosGet );

    router.post('/',[
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),  
      check('password', 'La contraseña debe contener al menos 6 caracteres').isLength({ min: 6 }), 
      check('email', 'Email no válido').isEmail(),            
      check('email').custom( emailAlreadyExist ),            
      // check('role', 'El rol no es permitido').isIn(['ADMIN_ROLE','USER_ROLE']),          
      check('role').custom( isValidRole ), 
            validateFields
      ], usuariosPost );

    router.put('/:id',[ 
        check('id', 'No es un iD válido').isMongoId(),
        check('id').custom( idAlreadyExist ),
        check('role').custom( isValidRole ), 
        validateFields
    ], usuariosPut );

    router.delete('/:id',[
      validateJWT,
      check('id', 'No es un iD válido').isMongoId(),
      check('id').custom( idAlreadyExist ),
      validateFields
    ], usuariosDelete );
    
    router.patch('/', usuariosPatch );
     

      module.exports = router;