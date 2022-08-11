const express = require('express');
var cors = require('cors');
require('dotenv').config();

const { dbConnection } = require('../database/config.db');


class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // API
    this.usersRoutePath = '/api/usuarios';
    
    // seccion: 10 
    this.authPath = '/api/auth';

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

      this.app.use( this.authPath, require('../routes/auth')); // seccion: 10
      this.app.use(this.usersRoutePath, require('../routes/users'));

  }

  listen() {

      this.app.listen(this.port, () => {
          console.log('Rest Server corriendo en el puerto', this.port);
      });
  }

}

module.exports = Server;