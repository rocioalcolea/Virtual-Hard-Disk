'use strict';
const Joi = require('joi');
const { generateError } = require('../../helpers');
const { crearUsuario } = require('../../baseDatos/crearUsuario');

const nuevoUsuario = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const schemaEmail = Joi.string().email().required();
    const schemaPass = Joi.required();
    const schemaNombre = Joi.required();

    let validation = schemaEmail.validate(email);
    if (validation.error) {
      throw generateError('Debes introducir un email válido', 400);
    }

    validation = schemaPass.validate(password);
    if (validation.error) {
      throw generateError('Debes introducir una password válida', 400);
    }

    validation = schemaNombre.validate(name);
    if (validation.error) {
      throw generateError('Debes introducir un nombre válido', 400);
    }
    const id = await crearUsuario(name, email, password);
    console.log(id);

    console.log(req.body);
    res.send({
      status: 'ok',
      message: 'Usuario creado, pendiente de validar',
      //data: id,
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = nuevoUsuario;
