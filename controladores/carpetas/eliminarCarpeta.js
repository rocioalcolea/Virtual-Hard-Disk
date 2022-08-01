'use strict';

const eliminarCarpeta = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Eliminar Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = eliminarCarpeta;
