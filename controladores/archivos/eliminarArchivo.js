'use strict';

const eliminarArchivo = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Eliminar Archivo',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = eliminarArchivo;
