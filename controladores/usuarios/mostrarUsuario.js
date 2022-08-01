'use strict';

//const getDB = require('../../baseDatos/db');
const { mostrarUsuarioPorId } = require('../../baseDatos/usuarios');

const mostrarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await mostrarUsuarioPorId(id);
    console.log('usuario:', usuario[0]);

    // creo un objeto con la información del usuario
    const infoUsuario = {
      id: usuario[0].id_usuario,
      nombre: usuario[0].name,
      mail: usuario[0].email,
      rol: usuario[0].rol,
      fechaRegistro: usuario[0].registrationDate,
    };

    // Dejo comentado para ver que lo que llega por req.params
    // siempre es un string
    //console.log('>>>>>', req.userAuth.id, id, req.userAuth.role);

    // si el usuario coincide con lo del token o
    // es admin añadir al objeto más informaciones
    /* if (req.userAuth.id === usuario[0].id || req.userAuth.role === 'admin') {
      //infoUsuario.id = usuario[0].id;
      infoUsuario.date = usuario[0].date;
      infoUsuario.email = usuario[0].email;
      infoUsuario.role = usuario[0].role;
    }
 */
    // invio info user

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
