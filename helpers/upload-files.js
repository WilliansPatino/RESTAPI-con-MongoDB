// done at section: 12 curso Node JS
const { v4: uuidv4 } = require('uuid');
const path = require('path'); // to manage url  (o!o)
const { response } = require('express');

const defaultAllow_extensions =  ['png','jpg','jpeg','gif','svg','webp']


const uploadFiles = ( files, validExtensions = defaultAllow_extensions, destfolder = '' ) => {

    console.log('defaultAllow_extensions >>>', defaultAllow_extensions)

    return new Promise( (resolve, reject) => { 

          // from request
    const { fupload } = files;

    console.log('files >>> ', fupload)
  
    // reemplazar el nombre del archivo
    const shorter_filename = fupload.name.split('.');
    // const shorter_filename = fupload.name.split('.');
    const extension_file = shorter_filename[ shorter_filename.length -1 ];

    console.log(shorter_filename);
    
    console.log('validExtensions >>> ',validExtensions);
    console.log('is a validExtensions ? >>> ',validExtensions.includes(extension_file));
    
    if ( !validExtensions.includes(extension_file) ) {
        return reject(`La extensión <.${extension_file}>  no está permitida -  Tipos de archivos válidos: ${validExtensions} `);
    }


        // assign different name to file, even to same file uploaded
        const temp_namefile = uuidv4() + '.' + extension_file;

        const uploadPath = path.join(__dirname, '../uploads/', destfolder, temp_namefile );  // (o!o)

        fupload.mv(uploadPath, (err) => {
          if (err) {
            console.log(err);
            reject ( err );
          }

          resolve(  temp_namefile  );
        });

  });

}


module.exports = {
    uploadFiles
}