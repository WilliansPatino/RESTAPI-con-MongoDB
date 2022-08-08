const mongoose = require('mongoose');


const dbConnection = async() => {

try {

    await mongoose.connect( process.env.MONGODB_CONNECTION, {
        

      // useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log('Base de datos en línea');

} catch (error) {

  console.log(error);
  throw new Error('Error al momento de conectar la BD');
}



}

module.exports = {
  dbConnection
}