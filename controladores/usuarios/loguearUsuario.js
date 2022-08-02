'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const comprobarCampos = require('./comprobarCampos');
const { mostrarUsuarioPorEmail } = require('../../baseDatos/usuarios');

const loguearUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const comprueba = await comprobarCampos(email, password);
    if (comprueba) {
      const usuario = await mostrarUsuarioPorEmail(email);

      const validPassword = await bcrypt.compare(password, usuario[0].password);
      if (validPassword) {
        //creo el payload del token
        const payload = { id: usuario[0].id_usuario };

        //firmo el webtoken
        const token = jwt.sign(payload, process.env.SECRET, {
          expiresIn: '30d',
        });

        //envio el token
        res.send({
          status: 'ok',
          message: 'Usuario logueado',
          data: token,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = loguearUsuario;
