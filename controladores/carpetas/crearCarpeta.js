'use strict';

const crearCarpeta = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Crear Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = crearCarpeta;
