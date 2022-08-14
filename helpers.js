'use strict';
require('dotenv').config();
const { format } = require('date-fns');
const crypto = require('crypto');
const sgEmail = require('@sendgrid/mail');
const Joi = require('joi');

//comprueba que existe email, con formato de email
const comprobarEmail = async (email) => {
  const schemaEmail = Joi.string().email().required();

  const validation = schemaEmail.validate(email);
  if (validation.error) {
    throw generateError('Debes introducir un email válido', 400);
  }

  return true;
};

//comprueba que existe el password y tiene entre 6 y 20 caracteres
const comprobarPassword = async (password) => {
  const schemaPass = Joi.string().required().min(6).max(20);

  const validation = schemaPass.validate(password);
  if (validation.error) {
    throw generateError(
      'Debes introducir una password válida de longitud menor  o igual que 20 y mayor o igual que 6',
      400
    );
  }

  return true;
};

//transformo el nombre de la carpeta en minúsculas y sin espacios
const nombreUnico = (nombre) => {
  return nombre.toLowerCase().trim().replace(/ /g, '');
};

//compruebo que existe nombre con un tamaño de entre 2 y 100
const comprobarName = async (name) => {
  const schemaPass = Joi.string().required().min(2).max(100);

  const validation = schemaPass.validate(name);
  if (validation.error) {
    throw generateError(
      'Debes introducir un nombre válido de longitud menor que 100 y mayor que 2',
      400
    );
  }

  return true;
};

sgEmail.setApiKey(process.env.SENDGRID_API_KEY);
const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};

//formatea la fecha
function formatDateToDB(dateObject) {
  return format(dateObject, 'yyyy-MM-dd HH:mm:ss');
}

//genera cadena aleatoria
function generarCadenaAleatoria(byteString) {
  return crypto.randomBytes(byteString).toString('hex');
}

//pepara el mail pasa sendGrid
async function sendEmail({ to, subject, body }) {
  try {
    console.log(body);
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      text: body,
      html: `
        <div>
        <h1>${subject}</h1>
        <p>${body}</p>
        </div>
        `,
    };

    await sgEmail.send(msg);
  } catch (error) {
    console.log('este es el error', error, ' ', error.message);
    throw new Error('Error enviando email');
  }
}

module.exports = {
  formatDateToDB,
  sendEmail,
  generateError,
  generarCadenaAleatoria,
  comprobarEmail,
  comprobarPassword,
  comprobarName,
  nombreUnico,
};
