const Joi = require('joi');
const { generateError } = require('../../helpers');

const comprobarCampos = async (email, password) => {
  const schemaEmail = Joi.string().email().required();
  const schemaPass = Joi.required();

  let validation = schemaEmail.validate(email);
  if (validation.error) {
    throw generateError('Debes introducir un email válido', 400);
  }

  validation = schemaPass.validate(password);
  if (validation.error) {
    throw generateError('Debes introducir una password válida', 400);
  }

  return true;
};

module.exports = comprobarCampos;
