
// to validate fields
const { validationResult } = require('express-validator');

const validateFields = (req, response, next) => {

      const errors = validationResult(req);
      if ( !errors.isEmpty() ) {
          return response.status(400).json(errors);
      }

      next();

}

module.exports = {
    validateFields
}