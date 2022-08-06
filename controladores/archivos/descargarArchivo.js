'use strict';

const descargarArchivo = async (req, res, next) => {
  try {
    /*     const download = require('download');
  
// Url of the image
const file = 'GFG.jpeg';
// Path at which image will get downloaded
const filePath = `${__dirname}/files`;
  
download(file,filePath)
.then(() => {
    console.log('Download Completed');
}) */
    res.send({
      status: 'ok',
      message: 'Descargar Archivo',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = descargarArchivo;
