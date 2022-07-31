'use strict';

const eliminarCarpeta = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Eliminar Carpeta',
    data: [],
  });
};

module.exports = eliminarCarpeta;
