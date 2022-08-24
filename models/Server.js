const express = require('express');
var cors = require('cors');
require('dotenv').config();

const { dbConnection } = require('../database/config.db');


class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    /*
    // API Endpoints
    this.usersRoutePath = '/api/usuarios';
    this.authPath = '/api/auth';        // seccion: 10
    */

    // los endpoints/rutas anteriores se cambia a este objeto
    this.paths = {
        auth:       '/api/auth',
        categories: '/api/categories',
        products:   '/api/products',
        usuarios:   '/api/usuarios'
    }



    // Connect the database
    this.connectDB();

    // Middlewares
    this.middleware();

    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middleware() {

      // CORS
      this.app.use(cors());

      // Lectura y parseo del body // Cuqluier info que venga en POST o 
      // DELETE va a serializar a formato JSON.
      this.app.use( express.json() );

      // Directorio público
      this.app.use(express.static('public'));
  }


  routes() {

      /* 
      this.app.use( this.authPath, require('../routes/auth')); // seccion: 10
      this.app.use(this.usersRoutePath, require('../routes/users'));
     
     //  se usa el nuevo modelo de ruta con el objeto 'this.paths' 
     *
     */
     this.app.use( this.paths.auth, require('../routes/auth') );
     this.app.use( this.paths.categories, require('../routes/categories') );
     this.app.use( this.paths.products, require('../routes/products') );
     this.app.use( this.paths.usuarios, require('../routes/users') );

  }

  listen() {

      this.app.listen(this.port, () => {
          console.log('Rest Server corriendo en el puerto', this.port);
      });
  }

}

module.exports = Server;