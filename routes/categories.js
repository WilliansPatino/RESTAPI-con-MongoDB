// Todo el Contenido de este archivo es nuevo para cubrir la seccion: 10
const { Router, request, response } = require('express');
const { check } = require('express-validator');  

const { validateJWT, isAdminRole } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');


const { createCategory, 
        searchCategoryById, 
        updateCategory, 
        getCategories, 
        removeCategory} = require('../controllers/categories');

const { categoryAlreadyExist, 
        idCategoryExist, 
        existCategoryByID } = require('../helpers/cat-validator');


// instancia del router
const router = Router();


/**
 *    Route for this endpoint: Categories
 * 
 *  {{url}}/api/categories
 */

// ---  Reserved for use testing while begin coding the routes
/*  router.get('/', (req = request, res = response) => {
    res.json('it works!')
 } );
  */

 /*  -- REST Services ** */

 // Create category - private / any user can with a valid token
  router.post('/', [
   validateJWT,
   check('name', 'Category name is required').not().isEmpty(), 
   validateFields
  ], createCategory );

 // Get all the categories - public
 router.get('/', getCategories );

// Get a category by Id / - public
router.get('/:id', [
  check('id').custom(existCategoryByID),
      check('id', 'No es un ID válido de Mongo o no corresponde con su entrada ').isMongoId(),
      validateFields
], searchCategoryById );


// Update category - private / anyone with a valid token 
router.put('/:id', [
    validateJWT,
    check('id', 'ID de Mongo no es válido ').isMongoId(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(idCategoryExist),
    check('id').custom(categoryAlreadyExist),
    validateFields
], updateCategory);

// Flag category as deleted / anyone with Admin role
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'ID de Mongo no es válido ').isMongoId(),
    check('id').custom(idCategoryExist),
    validateFields
], removeCategory );

/* router.put('/:id',[ 
  check('id', 'No es un iD válido').isMongoId(),
  check('id').custom( idAlreadyExist ),
  check('role').custom( isValidRole ), 
  validateFields
], usuariosPut ); */

/* router.post('/1',[
  check('email', 'Correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(), 
  validateFields
], login );

router.post('/2',[
  check('id_token', 'Token de Google es obligatorio').not().isEmpty(),
  validateFields
], googleSignIn ); */


module.exports = router;