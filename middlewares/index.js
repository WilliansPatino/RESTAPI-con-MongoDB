
const validateFields        = require('../middlewares/validate-fields');
const validateJWT           = require('../middlewares/validate-jwt');
const validateRoles         = require('../middlewares/validate-role');
const validateFileUpload    = require('./file-validator');


module.exports = {
    ... validateFields,
    ... validateJWT,
    ... validateRoles,
    ...validateFileUpload
}