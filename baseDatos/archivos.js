'use strict';

const { generateError } = require('../helpers');

const getDB = require('./db');
const subirArchivo = async (
  idUsuario,
  nombreArchivoReal,
  nombreArchivoEncriptado,
  nombreCarpeta = 'root',
  publico = false
) => {
  let connection;

  try {
    connection = await getDB();
    let directorio = [];

    //buscar el id del directorio a traves de su nombre
    if (nombreCarpeta === 'root') {
      [directorio] = await connection.query(
        `SELECT id_directorio FROM directorios  WHERE id_usuario=? AND name=?
      `,
        [idUsuario, idUsuario]
      );
    } else {
      //obtengo el id_directorio a traves de su nombre y del dueño de la carpeta
      [directorio] = await connection.query(
        `SELECT id_directorio FROM directorios  WHERE id_usuario=? AND name=?
      `,
        [idUsuario, nombreCarpeta]
      );
    }

    if (directorio[0] === undefined) {
      throw generateError(
        'No se puede subir archivo porque no se encuentra la carpeta',
        400
      );
    }

    //existe ya el archivo con ese nombre, en esa carpeta de ese dueño?

    const id_directorio = directorio[0].id_directorio;
    const [isExist] = await connection.query(
      `SELECT id_archivo FROM archivos  WHERE id_usuario=? AND name_real=? AND id_directorio=?
        `,
      [idUsuario, nombreArchivoReal, directorio[0].id_directorio]
    );

    if (isExist[0] != undefined) {
      throw generateError('Ya existe ese fichero en ese directorio', 400);
    }

    //añado el nombre de fichero a la base de datos con el resto de los campos.
    const [archivo] = await connection.query(
      ` INSERT INTO archivos (id_usuario, id_directorio,name_real, name_encriptado,publico) VALUES (?,?,?,?,?)`,
      [
        idUsuario,
        id_directorio,
        nombreArchivoReal,
        nombreArchivoEncriptado,
        publico,
      ]
    );

    return archivo.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const mostrarFicheros = async (idCarpeta) => {
  let connection;
  const id_carpeta = idCarpeta.id_carpeta;

  try {
    connection = await getDB();
    let directorio = [];

    //buscar el id del directorio a traves de su nombre

    [directorio] = await connection.query(
      `SELECT id_archivo, name_real FROM archivos  WHERE id_directorio=? 
      `,
      [id_carpeta]
    );

    if (directorio[0] === undefined) {
      throw generateError(
        'No se puede subir archivo porque no se encuentra la carpeta',
        400
      );
    }

    return directorio;
  } finally {
    if (connection) connection.release();
  }
};

const borrarFichero = async (idUsuario, nombreDirectorio, nombreArchivo) => {
  let connection;

  try {
    connection = await getDB();

    //buscar el id del directorio a traves de su nombre
    const [directorio] = await connection.query(
      `SELECT id_directorio FROM directorios  WHERE id_usuario=? AND name=?
    `,
      [idUsuario, nombreDirectorio]
    );

    if (directorio[0] === undefined) {
      throw generateError('No se encuentra la carpeta', 400);
    }
    const id_directorio = directorio[0].id_directorio;

    //buscar el id del directorio a traves de su nombre
    const [archivo] = await connection.query(
      `SELECT id_archivo, name_encriptado FROM archivos  WHERE id_usuario=? AND name_real=?
    `,
      [idUsuario, nombreArchivo]
    );

    if (archivo[0] === undefined) {
      throw generateError('No se encuentra el archivo', 400);
    }
    const id_archivo = archivo[0].id_archivo;

    try {
      await connection.query(
        `DELETE FROM archivos WHERE id_directorio=? AND id_usuario=? AND id_archivo=? 
      `,
        [id_directorio, idUsuario, id_archivo]
      );
    } catch (error) {
      throw generateError('error al borrar el fichero', 400);
    }

    return archivo[0].name_encriptado;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { subirArchivo, mostrarFicheros, borrarFichero };
