'use strict';

const loguearUsuario = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Usuario logueado',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = loguearUsuario;
