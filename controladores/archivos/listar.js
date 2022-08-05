'use strict';

const { mostrarFicheros } = require('../../baseDatos/archivos');

const listar = async (req, res, next) => {
  try {
    const id = req.params;

    const archivos = await mostrarFicheros(id);

    res.send({
      status: 'ok',
      message: 'Listar Archivos',
      data: [...archivos],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = listar;
