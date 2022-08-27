
/* 
  parameter:  fupload
  method      POST

*/

const fs = require('fs');
const path = require('path'); // to manage url  (o!o)
const { toUnicode } = require('punycode');

// Require the Cloudinary library
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFiles } = require("../helpers");
const { Usuario, Product } = require("../models");


const loadFiles = async(req, res = response) => {

  // console.log('req.files >>>', req.files); // eslint-disable-line

  try {

    // by default image files
    // const full_pathname = await uploadFiles(req.files,['md','txt'], 'documentos');
    const full_pathname = await uploadFiles(req.files, undefined, 'images');
  
    res.json({
      /*  path: ({ full_pathname })*/
        full_pathname 
    });

  } catch (msg) {
      res.status(400).json({ msg })
  }

}


const updateImage = async(req, res = response) => {

  const { id, collection } = req.params;

  let modelToUpdate;

  switch ( collection ) {
    case 'usuarios':

      modelToUpdate = await Usuario.findById(id);

      if ( !modelToUpdate ) {
        return res.status(400).json({
          msg: `No existe un usuario con este id: ${id}`
        });
      }
    break;

    case 'productos':
      modelToUpdate = await Product.findById(id);
      if ( !modelToUpdate ) {
        return res.status(400).json({
          msg: `No existe un producto con este id: ${id}`
        });
      }

    break;

    default:
      return res.status(500).json( { 
        msg: `the collection ${collection} is not implemented in the backend`
      })
  }

  // clean old images
  if ( modelToUpdate.img ) {
      // remove imagen at server
      const image_path = path.join(__dirname, '../uploads/', collection, modelToUpdate.img );  // (o!o)

      if ( fs.existsSync( image_path ) ) {  // verify exist image file on the path
          fs.unlinkSync( image_path );
      }
  }

  // upload image to the path based on collection
  const newpathFile = await uploadFiles(req.files, undefined, collection);
  modelToUpdate.img = newpathFile;

  // update in DB
  await modelToUpdate.save()

  res.json({ modelToUpdate });

}

const getImage = async(req, res = response) => {

  const { id, collection } = req.params;

  let modelToUpdate;

  switch ( collection ) {
    case 'usuarios':

      modelToUpdate = await Usuario.findById(id);

      if ( !modelToUpdate ) {
        return res.status(400).json({
          msg: `No existe un usuario con este id: ${id}`
        });
      }
    break;

    case 'productos':
      modelToUpdate = await Product.findById(id);
      if ( !modelToUpdate ) {
        return res.status(400).json({
          msg: `No existe un producto con este id: ${id}`
        });
      }

    break;

    default:
      return res.status(500).json( { 
        msg: `the collection ${collection} is not implemented in the backend`
      })
  }

  // clean old images
  if ( modelToUpdate.img ) {
      // remove imagen at server
      const image_path = path.join(__dirname, '../uploads/', collection, modelToUpdate.img );  // (o!o)

      if ( fs.existsSync( image_path ) ) {  // verify exist image file on the path
            return res.sendFile( image_path );
      }
  }

  // return placeholder
  const image_path = path.join(__dirname, '../assets/no-image.jpg' );  // (o!o)

  res.sendFile( image_path );

}

const updateImageAtCloudinary = async(req, res = response) => {

  const { id, collection } = req.params;

  let modelToUpdate;

  switch ( collection ) {
    case 'usuarios':

      modelToUpdate = await Usuario.findById(id);

      if ( !modelToUpdate ) {
        return res.status(400).json({
          msg: `No existe un usuario con este id: ${id}`
        });
      }
    break;

    case 'productos':
      modelToUpdate = await Product.findById(id);
      if ( !modelToUpdate ) {
        return res.status(400).json({
          msg: `No existe un producto con este id: ${id}`
        });
      }

    break;

    default:
      return res.status(500).json( { 
        msg: `the collection ${collection} is not implemented in the backend`
      })
  }

  // clean old images
  if ( modelToUpdate.img ) {
      // remove imagen at server
      const extracted_FileName = modelToUpdate.img.split('/');
      console.log('extracted_FileName >>> ', extracted_FileName);

      const cloudinaryName = extracted_FileName[ extracted_FileName.length -1 ];
      const [ cloudinaryPublicId ] = cloudinaryName.split('.');

      console.log('cloudinaryPublicId >>>', cloudinaryPublicId);
      
       cloudinary.uploader.destroy(cloudinaryPublicId);
  }

  /*    for testing 
  console.log('req.files.fupload >>> ', req.files.fupload)
  */

  // obtain temporary file path from file
  const { tempFilePath } = req.files.fupload;

  /*  for testing response from Cloudinary
  const serverResponse = await cloudinary.uploader.upload(tempFilePath);
  */
 
  // upload to cloud 
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  // update URL from image 
  modelToUpdate.img = secure_url;

  // update in DB
  await modelToUpdate.save()

  res.json({modelToUpdate});
}


module.exports = {
    loadFiles,
    updateImage,
    getImage,
    updateImageAtCloudinary
}