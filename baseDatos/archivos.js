'use strict';

const { generateError } = require('../helpers');

const getDB = require('./db');
const subirArchivo = async (
  idUsuario,
  nombreArchivo,
  nombreCarpeta = '9',
  publico = false
) => {
  let connection;
  console.log(idUsuario, nombreArchivo, nombreCarpeta, publico);
  try {
    connection = await getDB();

    //obtengo el id_directorio a traves de su nombre y del dueño de la carpeta
    const [directorio] = await connection.query(
      `SELECT id_directorio FROM directorios  WHERE id_usuario=? AND name=?
      `,
      [idUsuario, nombreCarpeta]
    );
    console.log(idUsuario, directorio);
    if (directorio[0] === 0) {
      throw generateError(
        'No se puede subir archivo porque no se encuentra la carpeta',
        400
      );
    }
    //existe ya el archivo con ese nombre, en esa carpeta de ese dueño?
    console.log('LLEGA AQUI');

    const id_directorio = directorio[0].id_directorio;
    const [isExist] = await connection.query(
      `SELECT id_archivo FROM archivos  WHERE id_usuario=? AND name=? AND id_directorio=?
        `,
      [idUsuario, nombreArchivo, directorio[0].id_directorio]
    );

    if (isExist[0] != undefined) {
      throw generateError('Ya existe ese fichero en ese directorio', 400);
    }

    //añado el nombre de fichero a la base de datos con el resto de los campos.
    const [archivo] = await connection.query(
      ` INSERT INTO archivos (id_usuario, id_directorio,name,publico) VALUES (?,?,?,?)`,
      [idUsuario, id_directorio, nombreArchivo, publico]
    );

    return archivo.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { subirArchivo };
