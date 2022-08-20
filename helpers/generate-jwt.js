// todo el código es nuevo para cubrir la seccion: 10

const jwt = require('jsonwebtoken');

const createJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => { 

        // aqui se puede incluir, nombre, edad, role. Sin embargo no es 
        // recomendable registar informacion sensible de la cuenta.
          const payload = { uid };

          console.log('New token was generated for this UID:', uid);

          jwt.sign( payload, process.env.PRIVATEORSECRETKEY, {
              expiresIn: '2h'
          }, ( err, token ) => {

              if (err) {
                  console.log(err);
                  reject('Hubo un fallo en la generación del token')
              } else {
                  resolve(token);
              }
          })
          
    })

}


module.exports = {
  createJWT
}