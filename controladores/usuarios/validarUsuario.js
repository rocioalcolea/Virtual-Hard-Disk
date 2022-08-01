'use strict';

const validarUsuario = async (req, res, next) => {
  try {
    res.send({
      status: 'ok',
      message: 'Usuario validado',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = validarUsuario;
