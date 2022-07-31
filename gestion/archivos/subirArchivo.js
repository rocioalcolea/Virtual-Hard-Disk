'use strict';

const subirArchivo = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Subir Archivo',
    data: [],
  });
};

module.exports = subirArchivo;
