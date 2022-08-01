'use strict';

const editarNombreA = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Editar Nombre',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = editarNombreA;
