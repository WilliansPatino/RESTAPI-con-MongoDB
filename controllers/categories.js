const { response, request } = require("express");
const { Category } = require("../models");

// To handle services at endpoint: Categories

/*   *** controladores requeridos
    - Obtener categoria, con paginado, total y populate (MOngoose)
    - Obtener categoria. regresar objeto populate {}

*/

const createCategory = async(req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    // check if there is existing category
    const categoryDB = await Category.findOne( {name} );

    if ( categoryDB ) {
        return res.status(400).json({
            msg: `Category already exists as ${categoryDB.name} `
        });
    }

  /*   
  *     Request User info
  
      res.json({ 
      'Logged user': req.authInfo.email, 
      'UID': req.authInfo._id    }) 
*/

   

    // generate data to save
    const data = {
      name,
      user: req.authInfo._id
    }

    const category = new Category(data)

    // save in DB
    await category.save();

    // res.status(201).json(category);
    res.status(201).json({
      msg: 'Category succesfully created',
      category,
      'Created by Logged user': req.authInfo.email, 
      'Associated to UID': req.authInfo._id 
});

}

// - Obtener categoria, con paginado, total y populate (MOngoose)
const getCategories = async(request, response) => {

  const { limite = 5, desde = 0 } = request.query;

  // obtain only the records with flag active
  const notDeleted = { status: true };


  // Se resolvera ambas/todas las promesas, ejecutandose de manera simultanea
  const [ total, categories ] = await Promise.all([
        Category.countDocuments(notDeleted),
        Category.find(notDeleted)            // solo activos
          .populate('user', 'nombre')
          .skip(Number(desde))              //  desde que registro comenzar
          .limit(Number(limite))           // # de items a mostrar
  ]);
  

  response.json({ 
      total,
      categories
      
    });
  }
  
  // - Obtener categoria. regresar objeto populate {}
  const searchCategoryById = async(req = request, res = response) => {
    
    const  { id }   = req.params;
    console.log('Search ID for cat', id)
  
    // check if there is existing category
    const category = await Category.findById(id).populate('user', 'nombre');
  
    try {
      res.status(201).json(
        category
      );

    } catch (error){
      throw new Error

    }


}

// Update category
const updateCategory = async(req = request, res = response ) => {

      // sent from request
      const  { id }   = req.params;

      // extract the fields to avoid injection 
      const { status, usuario, ... data } = req.body;
      // in this case 'status and usuario' can't be updated

      // Category  name must be capitalized, always
      data.name = req.body.name.toUpperCase();

      // who did the last update - token owner
      data.usuario = req.authInfo._id;

      // update in database
      const update_categ = await Category.findByIdAndUpdate(id, data, { new: true} );
 


    // res.status(201).json(category);
    res.status(201).json({
      msg: 'Category succesfully updated',
      update_categ,
      'by Logged user': req.authInfo.email, 
      'Associated to UID': req.authInfo._id 
    });
}


// Mark status as deleted
const removeCategory = async(req, res) => {

   // sent from request
   const  { id }   = req.params;

  // search und update
  const mark_categ = await Category.findByIdAndUpdate(id, {status: false}, { new: true});

  // res.status(201).json(category);
  res.status(201).json({
    mark_categ,
    'by Logged user': req.authInfo.email
  });
}


module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  removeCategory,
  searchCategoryById

}