'use strict';

const { crearUsuario } = require('../../baseDatos/usuarios');
const comprobarCampos = require('./comprobarCampos');

const nuevoUsuario = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const comprueba = await comprobarCampos(email, password);
    if (comprueba && name) {
      const id = await crearUsuario(name, email, password);

      res.send({
        status: 'ok',
        message: 'Usuario creado, pendiente de validar',
        data: id,
      });
    } else {
      res.send({
        status: 'error',
        message: 'Comprueba que los campos se han itroducido correctamente',
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = nuevoUsuario;
