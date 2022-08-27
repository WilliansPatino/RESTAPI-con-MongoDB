
const { Schema, model } = require('mongoose');

const ProductSchema = Schema({

    name: {
      type: String,
      required: [true, 'Nombre es obligatorio'],
      unique: true
    },
    status: {
      type: Boolean,
      default: true,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    price: {
      type: Number,
      default: 0.00
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    description: { type: String},
    available: { type: Boolean, default: true },
    img: { type: String },
});

// extraer selectivamente los campos que no vamos a usar del objeto
ProductSchema.methods.toJSON = function() {
  const { __v, status, ... visible_data  } = this.toObject();
  //    fields to exclude are put BEFORE the three points ...

  return visible_data;
}


module.exports = model( 'Product', ProductSchema )
