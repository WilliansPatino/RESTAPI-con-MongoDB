const { Router } = require('express');
const { check } = require('express-validator');  

const { validateFields } = require('../middlewares/validate-fields');

const { loadFiles,  
        updateImage, 
        getImage, 
        updateImageAtCloudinary } = require('../controllers/uploads');
        
const { allowedCollections } = require('../helpers/collections-validator');
const { validateFileUpload } = require('../middlewares');

const router = Router();

/*  upload files.  BY default only images */
// router.post('/', [], loadFiles);  // to test the endpoint from zero
router.post('/', [], validateFileUpload, loadFiles);

/*    upload user images  */ 
router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['usuarios','productos'])),
    validateFields
], updateImageAtCloudinary );
// ], updateImage );

/* obtain product image */
router.get('/:collection/:id', [
  check('id', 'El id debe ser de Mongo').isMongoId(),
  check('collection').custom( c => allowedCollections( c, ['usuarios','productos'])),
  validateFields
], getImage );

module.exports = router;