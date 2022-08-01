'use strict';

const descargarArchivo = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Descargar Archivo',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = descargarArchivo;
