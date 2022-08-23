
const { Schema, model } = require('mongoose');

const CategorySchema = Schema({

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
    }

});

// extraer selectivamente los campos que no vamos a usar del objeto
CategorySchema.methods.toJSON = function() {
  const { __v, status, ... visibleData  } = this.toObject();
  //    fields to exclude are put BEFORE the three points ...

  return visibleData;
}


module.exports = model( 'Category', CategorySchema )
