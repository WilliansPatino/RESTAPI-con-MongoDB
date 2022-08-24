const { Router, request, response } = require('express');
const { check } = require('express-validator');  

/*  
Correspondiente a la sección 12 de curso Node JS

*/

const { validateJWT, isAdminRole } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');

const { createProduct, 
        searchProductById, 
        updateProduct, 
        removeProduct, 
        getProducts } = require('../controllers/products');

const { existProductByID, 
        idProductExist, 
        productAlreadyExist, 
        productWasDeleted } = require('../helpers/prod-validator');

const { categoryAlreadyExist, 
  idCategoryExist, 
  existCategoryByID } = require('../helpers/cat-validator');

// instancia del router
const router = Router();

/**
 *    Endpoint for Products
 * 
 *  {{url}}/api/products
 * 
 */

 // Create Product - private / any user can with a valid token
 router.post('/', [
  validateJWT,
  check('name', 'Product name is required').not().isEmpty(), 
  // check('category', 'Category name is required').not().isEmpty(), 
  check('category', 'ID de Mongo no es válido ').isMongoId(),
  check('category').custom(existCategoryByID),
  check('description', 'Description is required').not().isEmpty(), 
  validateFields
 ], createProduct );

// Get all the Products - public
  router.get('/', getProducts );

// Get a Product by Id / - public
router.get('/:id', [
  check('id', 'No es un ID válido de Mongo o no corresponde con su entrada ').isMongoId(),
  check('id').custom(existProductByID),
  validateFields
], searchProductById );

// Update Product - private / anyone with a valid token 
router.put('/:id', [
  validateJWT,
  isAdminRole,
  check('id', 'ID de Category de Mongo no es válido ').isMongoId(),
  check('id').custom(existProductByID),
  check('id').custom(idProductExist),
  validateFields
], updateProduct);

// Flag Product as deleted / anyone with Admin role
router.delete('/:id',[
  validateJWT,
  isAdminRole,
  check('id', 'ID de Mongo no es válido ').isMongoId(),
  check('id').custom(existProductByID),
  check('id').custom(productWasDeleted),
  validateFields
], removeProduct );

module.exports = router;
