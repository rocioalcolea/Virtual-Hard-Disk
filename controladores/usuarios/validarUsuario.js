'use strict';
const { activarUsuario } = require('../../baseDatos/usuarios');
const validarUsuario = async (req, res, next) => {
  const { registrationCode } = req.body;

  try {
    await activarUsuario(registrationCode);

    res.send({
      status: 'ok',
      message: 'Usuario validado',
    });
  } catch (error) {
    next(error);
  }
};
module.exports = validarUsuario;
