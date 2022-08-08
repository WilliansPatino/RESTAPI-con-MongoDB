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
  const { isValidRole, emailAlreadyExist, 
      idAlreadyExist } = require('../helpers/db-validators');

  
    // endpoints
    router.get('/', usuariosGet );

    router.post('/',[
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),  
      check('password', 'La contraseña debe contener al menos 6 caracteres').isLength({ min: 6 }), 
      // check('email', 'Email no válido').isEmail(),            
      check('email').custom( emailAlreadyExist ),            
      // check('role', 'El rol no es permitido').isIn(['ADMIN_ROLE','USER_ROLE']),          
      check('role').custom( isValidRole ), 
            validateFields
      ] , usuariosPost );

    // PUT  
    router.put('/:id',[ // validacion en el arreglo
        check('id', 'No es un iD válido').isMongoId(),
        check('id').custom( idAlreadyExist ),
        check('role').custom( isValidRole ), 
        validateFields
    ], usuariosPut );

    router.patch('/',[
        check('id', 'No es un iD válido').isMongoId(),
        check('id').custom( idAlreadyExist ),
        check('id').custom( idAlreadyExist ),
        validateFields
    ], usuariosPatch );

    router.delete('/:id',[
        check('id', 'No es un iD válido').isMongoId(),
        check('id').custom( idAlreadyExist ),
      validateFields
    ], usuariosDelete );

     

      module.exports = router;