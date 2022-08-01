'use strict';

const listar = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Listar Archivos',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = listar;
