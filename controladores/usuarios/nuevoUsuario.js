'use strict';
require('dotenv').config();
const { crearUsuario } = require('../../baseDatos/usuarios');
const {
  generarCadenaAleatoria,
  sendEmail,
  comprobarEmail,
  comprobarPassword,
  comprobarName,
} = require('../../helpers');

const nuevoUsuario = async (req, res, next) => {
  try {
    // Creo un código de registro (contraseña temporal de un solo uso)
    const registrationCode = generarCadenaAleatoria(40);

    //email con enlace de activaciones
    const mail = `
   Acabas de crear una cuenta en DISCO DURO VIRTUAL.
   Pulsa en este enlace para activar el usuario: ${process.env.PUBLIC_HOST}/usuarios/validar/${registrationCode}
 `;
    //recoje y comprueba los datos que le pasamos en el json (nombre, email y contraseña)
    const { name, email, password } = req.body;
    const compruebaEmail = await comprobarEmail(email);
    const compruebaPassword = await comprobarPassword(password);
    const compruebaName = await comprobarName(name);

    if (compruebaEmail && compruebaPassword && compruebaName) {
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
