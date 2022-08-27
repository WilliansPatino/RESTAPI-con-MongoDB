/* 

    Para validar las colecciones permitidas

*/
const allowedCollections = (collection = '', collections = [] ) => {

      const validCollection = collections.includes( collection );
      
      if ( !validCollection ) {
          throw new Error(`La colección ${collection} no es válida. Son permitidas: ${collections} `)
      }

      return true;

};

module.exports = {
    allowedCollections
}
