'use strict';

const { mostrarUsuarioPorId } = require('../../baseDatos/usuarios');
const { generateError } = require('../../helpers');

const mostrarUsuario = async (req, res, next) => {
  try {
    //recogemos id por parametro
    const { idParametro } = req.params;

    //recogemos id por token
    const id = req.idPropietario;
    const rol = req.rolPropietario;

    //si el usuario es el propietario de los datos o es el administrador, que los muestre.
    if (idParametro === id.toString() || rol === 'admin') {
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
        message: 'Datos del usuario',
        data: infoUsuario,
      });
    } else {
      throw generateError(
        'No se puede mostrar informacion porque el id no le corresponde',
        400
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = mostrarUsuario;
