'use strict';
const { activarUsuario } = require('../../baseDatos/usuarios');
const validarUsuario = async (req, res, next) => {
  const { registrationCode } = req.params;

  try {
    await activarUsuario(registrationCode);

    res.send({
      status: 'ok',
      message: 'Usuario validado',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
module.exports = validarUsuario;
