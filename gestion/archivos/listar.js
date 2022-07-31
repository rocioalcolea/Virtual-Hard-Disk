'use strict';

const listar = async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Listar Archivos',
    data: [],
  });
};

module.exports = listar;
