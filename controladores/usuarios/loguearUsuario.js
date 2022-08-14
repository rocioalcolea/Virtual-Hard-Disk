'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const {
  mostrarUsuarioPorEmail,
  isActivated,
} = require('../../baseDatos/usuarios');
const {
  comprobarEmail,
  comprobarPassword,
  generateError,
} = require('./../../helpers');

const loguearUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const compruebaEmail = await comprobarEmail(email);
    const compruebaPassword = await comprobarPassword(password);

    //compruebo que se han introducido usuario y contraseña
    if (compruebaEmail && compruebaPassword) {
      const usuario = await mostrarUsuarioPorEmail(email);

      //compruebo que la contraseña es válida
      const validPassword = await bcrypt.compare(password, usuario[0].password);

      if (!(await isActivated(usuario[0].id_usuario))) {
        throw generateError(
          'El usuario no está validado, entra en tu correo para validar',
          400
        );
      }
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
