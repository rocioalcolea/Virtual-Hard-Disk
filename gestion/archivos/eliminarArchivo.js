'use strict';

const eliminarArchivo = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Eliminar Archivo',
    data: [],
  });
};

module.exports = eliminarArchivo;
