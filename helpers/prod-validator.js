const { Product }  = require('../models')



/*

Validator for Product

*/


const existProductByID = async(id) => {
  
  console.log('Exist this ID Cat', id)
  const findProduct = await Product.findById(id);

  if ( !findProduct ) {
    throw new Error(`Producto con este  ID ${id} no  existe.`)
  }
}

const productAlreadyExist = async( name = '' ) => {

  // validar si ya existe 
  const isAnExistingProduct = await Product.findOne({ name });
  if (isAnExistingProduct) {
        throw new Error(`El producto  ${ name } ya fue registrado`)
        // return response.status(400).json({
        //     msg: 'Este email ya fue registrado!'
        // });
  }

}


const idProductExist = async( id ) => {

    // validar si ya existe el  email
    const isExistingId = await Product.findById(id);
    if ( !isExistingId ) {
          throw new Error(`Este ID ${ id} no existe!`)
    }

}

const productWasDeleted = async (id) => {

  const deleted_product = await Product.findById(id);
  console.log('> Deleted product Status: ', deleted_product.status )

    if ( !deleted_product.status ) {
        throw new Error(`This producto has already been deleted `)

    }
}


module.exports = {
  existProductByID,
  productAlreadyExist,
  idProductExist, 
  productWasDeleted
}