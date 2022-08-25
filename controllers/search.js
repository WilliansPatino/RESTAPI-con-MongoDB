const { response, request } = require('express')
const { Usuario, Product, Category } = require('../models')

const { ObjectId } = require('mongoose').Types // (**1)

/* 
    parameters required
      - collection
      - term

*/

allowed_collection = ['usuarios', 'categorias', 'productos', 'roles']

const searchUsers = async (term = '', res = response) => {
      // search by ID
      const isMongoId = ObjectId.isValid(term) // (**1)  True or false

      if (isMongoId) {
        const user = await Usuario.findById(term)
        return res.json({
          results: user ? [user] : [],
        })
      }

      // Search by name or email
      const regexp = new RegExp(term, 'i') // for insensitive search

      const users = await Usuario.find({
        $or: [{ nombre: regexp }, { email: regexp }],
        $and: [{ status: true }], // exclude not active
      })

      return res.json({
        results: users,
      })
} // searchUsers

const searchCategories = async (term = '', res = response) => {
  // search by ID
  const isMongoId = ObjectId.isValid(term) // (**1)  True or false

  if (isMongoId) {
    const category = await Category.findById(term)
    return res.json({
      results: category ? [category] : [],
    })
  }

  //  
  const regexp = new RegExp(term, 'i') // for insensitive search

  const categories = await Category.find({
    $or: [{ name: regexp } ],
    $and: [{ status: true }], // exclude not active
  })

  return res.json({
    results: categories
  })
} // searchCat

const searchProducts = async (term = '', res = response) => {
  // search by ID
  const isMongoId = ObjectId.isValid(term) // (**1)  True or false

  if (isMongoId) {
    const product = await  Product.findById(term)
      .populate('category', 'name');

    return res.json({
      results: product ? [product] : [],
    })
  }

  // 
  const regexp = new RegExp(term, 'i') // for insensitive search

  const products = await Product.find({
    $or: [{ name: regexp }, { description: regexp }],
    $and: [{ status: true }], // exclude not active
  })
  .populate('category', 'name');

  return res.json({
    results: products,
  })
} // searchProd

const search = (req = request, res = response) => {
  const { collection, term } = req.params

  if (!allowed_collection.includes(collection)) {
    return res.status(400).json({
      msg: ` las colecciones permitidas son: ${allowed_collection}`,
    })
  }

  switch (collection) {
    case 'usuarios':
      searchUsers(term, res)
      break
    case 'categorias':
      searchCategories(term, res)
      break
    case 'productos':
      searchProducts(term, res)
      break

    default:
      res.status(500).json({
        msg: ' No ha sido incluida esta búsqueda',
      })
  }
}

module.exports = {
  search,
}
