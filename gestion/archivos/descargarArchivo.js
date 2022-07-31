'use strict';

const descargarArchivo = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Descargar Archivo',
    data: [],
  });
};

module.exports = descargarArchivo;
