// Todo el Contenido de este archivo es nuevo para cubrir la seccion: 10
const { Router } = require('express');
const { check } = require('express-validator');  
const { login } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

// instancia del router
const router = Router();

router.post('/login',[
  check('email', 'Correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(), 
  validateFields
], login );


module.exports = router;