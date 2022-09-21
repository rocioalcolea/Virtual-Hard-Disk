'use strict';

const { mostrarUsuarioPorId } = require('../../baseDatos/usuarios');

const mostrarUsuario = async (req, res, next) => {
  try {
    //recogemos id por token
    const id = req.idPropietario;

    const usuario = await mostrarUsuarioPorId(id);

    // creo un objeto con la información del usuario
    const infoUsuario = {
      id: usuario[0].id_usuario,
      nombre: usuario[0].name,
      mail: usuario[0].email,
      fechaRegistro: usuario[0].registrationDate,
    };

    res.send({
      status: 'ok',
      message: 'Datos del usuario',
      data: infoUsuario,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = mostrarUsuario;
