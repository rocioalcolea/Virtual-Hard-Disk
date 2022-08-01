'use strict';

const editarNombreC = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Editar Nombre Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = editarNombreC;
