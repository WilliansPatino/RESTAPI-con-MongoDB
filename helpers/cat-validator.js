const Category  = require('../models/category')



/*

Validator for Category

*/


const existCategoryByID = async(id) => {
  
  console.log('Exist this ID Cat', id)
  const findCategory = await Category.findById(id);

  if ( !findCategory ) {
    throw new Error(`Categoria con este  ID ${id} no  existe.`)
  }
}

const categoryAlreadyExist = async( name = '' ) => {

  // validar si ya existe 
  const isAnExistingCategory = await Category.findOne({ name });
  if (isAnExistingCategory) {
        throw new Error(`La categoría  ${ name } ya fue registrada`)
        // return response.status(400).json({
        //     msg: 'Este email ya fue registrado!'
        // });
  }

}


const idCategoryExist = async( id ) => {

// validar si ya existe el  email
const isExistingId = await Category.findById(id);
if ( !isExistingId ) {
      throw new Error(`Este ID ${ id} no existe!`)
}

}


module.exports = {
  existCategoryByID,
  categoryAlreadyExist,
  idCategoryExist
}