const { response } = require("express")

const validateFileUpload = (req, res = response, next) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg:'Ningun archivo fue cargado (validateFileUpload)' 
    });

  }

  if (!req.files.fupload) {
    return res.status(400).json({
      msg:'Es obligatorio usar "fupload" para cargar el archivo' 
    });
  }

  // is OK everything...
  next();

}

module.exports = {
  validateFileUpload
}