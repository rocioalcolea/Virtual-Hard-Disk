'use strict';
require('dotenv').config();
const { crearUsuario } = require('../../baseDatos/usuarios');
const comprobarCampos = require('./comprobarCampos');
const { generarCadenaAleatoria, sendEmail } = require('../../helpers');

const nuevoUsuario = async (req, res, next) => {
  try {
    // Creo un código de registro (contraseña temporal de un solo uso)
    const registrationCode = generarCadenaAleatoria(40);

    //email con enlace de activaciones
    const mail = `
   Acabas de crear una cuenta en DISCO DURO VIRTUAL.
   Pulsa en este enlace para activar el usuario: ${process.env.PUBLIC_HOST}/usuarios/validar/${registrationCode}
 `;

    const { name, email, password } = req.body;
    const comprueba = await comprobarCampos(email, password);
    if (comprueba && name) {
      const id = await crearUsuario(name, email, password, registrationCode);

      // eviamos el correo de validación del usuario creado
      await sendEmail({
        to: email,
        subject: "Correo de activación usuario de 'DISCO DURO VIRTUAL'",
        body: mail,
      });

      res.send({
        status: 'ok',
        message: 'Usuario creado, pendiente de validar',
        data: id,
      });
    } else {
      res.send({
        status: 'error',
        message: 'Comprueba que los campos se han introducido correctamente',
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = nuevoUsuario;
