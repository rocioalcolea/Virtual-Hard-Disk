'use strict';
require('dotenv').config();
const { format } = require('date-fns');
const crypto = require('crypto');
const sgEmail = require('@sendgrid/mail');

sgEmail.setApiKey(process.env.SENDGRID_API_KEY);
const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};

function formatDateToDB(dateObject) {
  return format(dateObject, 'yyyy-MM-dd HH:mm:ss');
}

function generarCadenaAleatoria(byteString) {
  return crypto.randomBytes(byteString).toString('hex');
}
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
    throw new Error('Error enviando email');
  }
}

module.exports = {
  formatDateToDB,
  sendEmail,
  generateError,
  generarCadenaAleatoria,
};
