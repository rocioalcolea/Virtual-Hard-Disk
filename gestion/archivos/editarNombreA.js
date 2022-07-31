'use strict';

const editarNombreA = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Editar Nombre',
    data: [],
  });
};

module.exports = editarNombreA;
