'use strict';

const { generateError } = require('../helpers');

const getDB = require('./db');

const crearCarpeta = async (idUsuario, nombreCarpeta, publico = false) => {
  let connection;
  try {
    connection = await getDB();
    const [directorio] = await connection.query(
      `SELECT name FROM directorios where id_usuario=?
    `,
      [idUsuario]
    );

    if (directorio[0].name == nombreCarpeta) {
      throw generateError('Ese nombre de carpeta ya existe', 400);
    }
    const [result] = await connection.query(
      ` INSERT INTO directorios (id_usuario, name,publico) VALUES (?,?,?)`,
      [idUsuario, nombreCarpeta, publico]
    );
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const modificarNombreCarpeta = async (
  idUsuario,
  nombreCarpeta,
  nuevoNombreCarpeta
) => {
  let connection;
  try {
    connection = await getDB();
    const [directorio] = await connection.query(
      `SELECT id_usuario, name FROM directorios where id_usuario=? AND name=?
      `,
      [idUsuario, nombreCarpeta]
    );
    console.log(directorio);
    if (directorio[0] === 0) {
      throw generateError('Esa carpeta no existe o no le pertenece', 400);
    }
    const [result] = await connection.query(
      ` UPDATE directorios SET  name=? WHERE name=?`,
      [nuevoNombreCarpeta, nombreCarpeta]
    );
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const modificarPermisos = async (idUsuario, nombreCarpeta, publico) => {
  let connection;
  try {
    connection = await getDB();
    const [directorio] = await connection.query(
      `SELECT id_usuario, name FROM directorios where id_usuario=? AND name=?
      `,
      [idUsuario, nombreCarpeta]
    );
    console.log(directorio);
    if (directorio[0] === 0) {
      throw generateError('Esa carpeta no existe o no le pertenece', 400);
    }
    const [result] = await connection.query(
      ` UPDATE directorios SET  publico=? WHERE name=?`,
      [publico, nombreCarpeta]
    );
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const eliminarDirectorio = async (idUsuario, idDirectorio) => {
  let connection;
  try {
    connection = await getDB();
    const [directorio] = await connection.query(
      `DELETE FROM directorios where id_usuario=? AND id_directorio=?
      `,
      [idUsuario, idDirectorio]
    );

    console.log(directorio);
    return directorio;
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  crearCarpeta,
  modificarNombreCarpeta,
  modificarPermisos,
  eliminarDirectorio,
};
