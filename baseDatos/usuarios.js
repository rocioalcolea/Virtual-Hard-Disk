'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();

const { generateError, formatDateToDB } = require('../helpers');
const getDB = require('./db');

const mostrarUsuarioPorEmail = async (email) => {
  // pido conneción al DB
  let connection;
  try {
    connection = await getDB();

    // leer  la info del usuario

    const [result] = await connection.query(
      `
         SELECT id_usuario, name, email, password, active, rol, registrationDate
         FROM usuarios
         WHERE email=?
         `,
      [email]
    );
    console.log(result);
    if ([result] === 0) {
      throw generateError('no hay ningun usuario con ese email', 404);
    }
    return result;
  } finally {
    if (connection) connection.release;
  }
};

const mostrarUsuarioPorId = async (id) => {
  // pido conneción al DB
  let connection;
  try {
    connection = await getDB();

    // leer  la info del usuario

    const [result] = await connection.query(
      `
         SELECT id_usuario, name, email, password, active, rol, registrationDate
         FROM usuarios
         WHERE id_usuario=?
         `,
      [id]
    );
    console.log(result);
    if ([result] === 0) {
      throw generateError('no hay ningun usuario con esa id', 404);
    }
    return result;
  } finally {
    if (connection) connection.release;
  }
};

const crearUsuario = async (name, email, password) => {
  let connection;

  try {
    connection = await getDB();
    //comprobar email no esta en la base de datos

    const [result] = await connection.query(
      `
    SELECT id_usuario FROM usuarios WHERE email=?
    `,
      [email]
    );

    if (result.length > 0) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }

    //encriptar
    const passwordHash = await bcrypt.hash(password, 8);

    //crear usuario
    const [nuevoUsuario] = await connection.query(
      `
    INSERT INTO usuarios(name,email,password,active,registrationDate) VALUES (?,?,?,?,?)
    `,
      [name, email, passwordHash, false, formatDateToDB(new Date())]
    );

    //devolver la id

    return nuevoUsuario.insertId;
  } finally {
    if (connection) {
      connection.release;
    }
  }
};

module.exports = {
  crearUsuario,
  mostrarUsuarioPorId,
  mostrarUsuarioPorEmail,
};
