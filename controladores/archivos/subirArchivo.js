'use strict';

const subirArchivo = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Subir Archivo',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = subirArchivo;
