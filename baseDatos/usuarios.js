'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');
const { generateError, formatDateToDB } = require('../helpers');
const getDB = require('./db');
const fs = require('fs').promises;

/**NOMBRE: mostrarUsuarioPorEmail
 * PARÁMETROS: email
 * FUNCION:mostrar usuario a través del email */
const mostrarUsuarioPorEmail = async (email) => {
  // pido conneción al DB
  let connection;
  try {
    connection = await getDB();

    // recoger la info del usuario a traves del email
    const [result] = await connection.query(
      `
         SELECT id_usuario, name, email, password, active, rol, registrationDate
         FROM usuarios
         WHERE email=?
         `,
      [email]
    );

    if ([result] === 0) {
      throw generateError('no hay ningun usuario con ese email', 404);
    }

    return result;
  } finally {
    if (connection) connection.release;
  }
};

/**NOMBRE: mostrarUsuarioPorId
 * PARÁMETROS: id
 * FUNCION:mostrar usuario a través del id */
const mostrarUsuarioPorId = async (id) => {
  // pido conneción al DB
  let connection;
  try {
    connection = await getDB();

    // recoger  la info del usuario a través del Id
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

/**NOMBRE: activarUsuario
 * PARÁMETROS: registrationCode
 * FUNCION:Activar usuario a través del codigo de registro */
const activarUsuario = async (registrationCode) => {
  let connection;
  try {
    connection = await getDB();

    //encontrar el id del usuario a través del codigo de registro
    const [result] = await connection.query(
      `
      SELECT id_usuario FROM usuarios WHERE registrationCode=?
    `,
      [registrationCode]
    );

    //si no devuelve datos ese codigo de registro en la base de datos lanzo error
    if (result.length === 0) {
      throw generateError('Ningún código de validación encontrado', 404);
    }

    // activo el usuario y borro registrationCode
    await connection.query(
      `
        UPDATE usuarios
        SET active=true, registrationCode=NULL
        WHERE registrationCode=?
    `,
      [registrationCode]
    );
    return true;
  } finally {
    if (connection) connection.release;
  }
};

/**NOMBRE: crearUsuario
 * PARÁMETROS: nombre, email, contraseña y codigo de registro
 * FUNCION:crear nuevo usuario */
const crearUsuario = async (name, email, password, registrationCode) => {
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

    //si se encuentra algun resultado con ese email lanzo error
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
    INSERT INTO usuarios(name,email,password,active,registrationDate,registrationCode) VALUES (?,?,?,?,?,?)
    `,
      [
        name,
        email,
        passwordHash,
        false,
        formatDateToDB(new Date()),
        registrationCode,
      ]
    );

    //creo su carpeta raiz en la base de datos
    await connection.query(
      ` INSERT INTO directorios (id_usuario, name,publico) VALUES (?,?,?)`,
      [nuevoUsuario.insertId, nuevoUsuario.insertId, false]
    );

    //creo la carpeta de usuario, en el servidor,
    const nuevaCarpetaUsuario = path.join(
      __dirname,
      `..`,
      `discoDuro`,
      `${nuevoUsuario.insertId}`
    );
    try {
      await fs.mkdir(nuevaCarpetaUsuario);
    } catch (error) {
      throw generateError('no se puede crear la carpeta de usuario', 500);
    }

    //devolver la id del nuevo usuario creado
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
  activarUsuario,
};
