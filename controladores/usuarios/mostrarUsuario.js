'use strict';

const { mostrarUsuarioPorId } = require('../../baseDatos/usuarios');

const mostrarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await mostrarUsuarioPorId(id);

    // creo un objeto con la información del usuario
    const infoUsuario = {
      id: usuario[0].id_usuario,
      nombre: usuario[0].name,
      mail: usuario[0].email,
      rol: usuario[0].rol,
      fechaRegistro: usuario[0].registrationDate,
    };

    res.send({
      status: 'ok',
      message: 'Mostrar usuario',
      data: infoUsuario,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = mostrarUsuario;
