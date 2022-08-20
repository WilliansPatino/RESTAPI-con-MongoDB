// Todo el Contenido de este archivo es nuevo para cubrir la seccion: 10
const { Router } = require('express');
const { check } = require('express-validator');  
const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

// instancia del router
const router = Router();

router.post('/login',[
  check('email', 'Correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(), 
  validateFields
], login );

router.post('/google',[
  check('id_token', 'Token de Google es obligatorio').not().isEmpty(),
  validateFields
], googleSignIn );


module.exports = router;