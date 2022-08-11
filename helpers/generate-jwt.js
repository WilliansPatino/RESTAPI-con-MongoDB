// todo el código es nuevo para cubrir la seccion: 10

const jwt = require('jsonwebtoken');

const createJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => { 

        // aqui se puede incluir, nombre, edad, role. Sin embargo no es 
        // recomendable registar informacion sensible de la cuenta.
          const payload = { uid };

          jwt.sign( payload, process.env.PRIVATEORSECRETKEY, {
              expiresIn: '4h'
          }, ( err, token ) => {

              if (err) {
                  console.log(err);
                  reject('No se pude generar el token')
              } else {
                  resolve(token);
              }
          })
          
    })

}


module.exports = {
  createJWT
}