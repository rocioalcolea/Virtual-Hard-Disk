'use strict';

const { generateError } = require('../helpers');
//const { generateError } = require('../helpers');
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

module.exports = { crearCarpeta };
