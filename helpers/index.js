const dbValidators    = require('./db-validators');
const generateJWT     = require('./generate-jwt');
const catValidators   = require('./cat-validator');
const googleVerify    = require('./google-verify');
const prodValidators  = require('./prod-validator');
const uploadFiles     = require('./upload-files');

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...catValidators,
  ...googleVerify,
  ...prodValidators,
  ...uploadFiles
}