'use strict';

const crearCarpeta = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Crear Carpeta',
    data: [],
  });
};

module.exports = crearCarpeta;
