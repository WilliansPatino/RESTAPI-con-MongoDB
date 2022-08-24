const { response, request } = require("express");

const { Product }  = require('../models');

const { categoryAlreadyExist, 
  idCategoryExist, 
  existCategoryByID } = require('../helpers/cat-validator');

// To handle services at endpoint: Productes

/*   *** controladores requeridos
    - Obtener Product, con paginado, total y populate (MOngoose)
    - Obtener Product. regresar objeto populate {}

*/

const createProduct = async(req = request, res = response) => {

  
  try {
      // exclude some parameters from the request
      const { status, user, ... _body } = req.body;
      

        // check if there is existing Product
        const product_inDB = await Product.findOne( { name: _body.name } );
        //  name: _body.name     - extract from the object sent in request

        if ( product_inDB ) {
            return res.status(400).json({
                msg: `Product already exists as ${product_inDB.name} `
            });
        }

        // generate data to save
        const data = {
          ..._body,
          name: _body.name.toUpperCase(),
          user: req.authInfo._id,
        }

        const product = new Product(data)

        // save in DB
        await product.save();

        // res.status(201).json(Product);
        res.status(201).json({
          msg: 'Product succesfully created',
          product,
          'Created by Logged user': req.authInfo.email, 
          'Associated to UID': req.authInfo._id 
    });

    } catch (error) {
        console.log(error)
    }

}

// - Obtener Producta, con paginado, total y populate (MOngoose)
const getProducts = async(request, response) => {

  const { limite = 5, desde = 0 } = request.query;

  // obtain only the records with flag active
  const notDeleted = { status: true };


  // Se resolvera ambas/todas las promesas, ejecutandose de manera simultanea
  const [ total, Products ] = await Promise.all([
        Product.countDocuments(notDeleted),
        Product.find(notDeleted)            // solo activos
          .populate('user', 'nombre')
          .populate('category', 'name')
          .skip(Number(desde))              //  desde que registro comenzar
          .limit(Number(limite))           // # de items a mostrar
  ]);
  

  response.json({ 
      total,
      Products
      
    });
  }
  
  // - Obtener Producta. regresar objeto populate {}
  const searchProductById = async(req = request, res = response) => {
    
    const  { id }   = req.params;
    console.log('Search product by using this:', id)
  
    // check if there is existing Product
    const product = await Product.findById(id)
        .populate('user', 'nombre')
        .populate('category', 'name');

  
    try {
      res.status(201).json(
        product
      );

    } catch (error){
      throw new Error

    }


}

// Update Product
const updateProduct = async(req = request, res = response ) => {

      // sent from request
      const  { id }   = req.params;

      // extract the fields to avoid injection 
      const { status, user, ... data } = req.body;
      // in this case 'status and usuario' can't be updated

      // Product  name must be capitalized, always
      if ( data.name ) {

        data.name = req.body.name.toUpperCase();
      }

      // who did the last update - token owner
      data.usuario = req.authInfo._id;

      // update in database
      const update_product = await Product.findByIdAndUpdate(id, data, { new: true} );
 


    // res.status(201).json(Product);
    res.status(201).json({
      msg: 'Product succesfully updated',
      update_product,
      'by Logged user': req.authInfo.email, 
      'Associated to UID': req.authInfo._id 
    });
}


// Mark status as deleted
const removeProduct = async(req, res) => {

   // sent from request
   const  { id }   = req.params;

  // update the record
  const deleted_product = await Product.findByIdAndUpdate(id, {status: false}, { new: true});

  // res.status(201).json(Product);
  res.status(201).json({
    deleted_product,
    'by Logged user': req.authInfo.email,
    'Associated to UID': req.authInfo._id 
  });
}


module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  removeProduct,
  searchProductById

}