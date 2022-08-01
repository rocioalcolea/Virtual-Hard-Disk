'use strict';

const modificarUsuario = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Usuario modificado',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = modificarUsuario;
