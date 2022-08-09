'use strict';

const { generateError } = require('../helpers');
const { modificarPermisos } = require('../baseDatos/archivos');
const getDB = require('./db');

/**NOMBRE: crearDirectorio
 * PARÁMETROS: id de usuario, nombre de directorio y permisos.
 * FUNCION:crear nuevo directorio*/
const crearDirectorio = async (
  idUsuario,
  nombreUnico,
  nombreDirectorio,
  publico = false
) => {
  let connection;
  try {
    connection = await getDB();
    //Seleccionar los directorios pertenecientes al usuario
    const [directorio] = await connection.query(
      `SELECT nameUnique FROM directorios where id_usuario=?
    `,
      [idUsuario]
    );

    //compruebo que el nombre del nuevo directorio no aparece ya en la base de datos de ese usuario
    for (const valor of directorio) {
      if (valor.name === nombreUnico) {
        throw generateError('Ese nombre de carpeta ya existe', 400);
      }
    }

    //añado una tupla con el nombre del directorio, el id del usuario al que pertenece, y los permisos del directorio
    const [result] = await connection.query(
      ` INSERT INTO directorios (id_usuario, name,nameUnique,publico) VALUES (?,?,?,?)`,
      [idUsuario, nombreDirectorio, nombreUnico, publico]
    );

    //devuelvo el id del directorio creado
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: buscarDirectorio
 * PARÁMETROS: id de usuario, rolUsuario, nombre de directorio.
 * FUNCION:buscar un directorio por nombre*/
const buscarDirectorio = async (idUsuario, nombreDirectorio) => {
  let connection;
  try {
    connection = await getDB();

    //busco el directorio perneceneciente a ese usuario y con a través de nombre unico
    const [busquedaUsuario] = await connection.query(
      `SELECT id_directorio,name FROM directorios WHERE nameUnique=? AND id_usuario=?`,
      [nombreDirectorio, idUsuario]
    );

    //error si no se encuentra el directorio
    if (busquedaUsuario[0] === undefined) {
      throw generateError('No se ha encontrado la Carpeta con ese nombre', 400);
    }

    //devuelvo datos de busqueda si encuentra el direcotrio
    return busquedaUsuario;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: modificarNombreDirectorio
 * PARÁMETROS: id de usuario, nombre de Directorio y nuevo nombre de directorio.
 * FUNCION:modificar el nombre del directorio*/
const modificarNombreDirectorio = async (
  idUsuario,
  idDirectorio,
  nuevoNombre,
  nuevoNombreUnico
) => {
  let connection;
  try {
    connection = await getDB();

    //actualizar el nuevo nombre del directorio y su nombre único
    const [result] = await connection.query(
      ` UPDATE directorios SET  name=?, nameUnique=?  WHERE id_directorio=? AND id_Usuario=?`,
      [nuevoNombre, nuevoNombreUnico, idDirectorio, idUsuario]
    );

    if (result.affectedRows === 0) {
      return 'no se ha encontrado esa carpeta';
    }
    return result.info;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: modificarPermisos del directorio
 * PARÁMETROS: id de usuario, id de Directorio y nuevos permisos.
 * FUNCION:modificar el nombre del directorio*/
const modificarPermisosD = async (idUsuario, idDirectorio, publico) => {
  let connection;
  try {
    connection = await getDB();
    //actualiza el valor de los permisos de la carpeta indicada del usuario propietario
    const [result] = await connection.query(
      ` UPDATE directorios SET  publico=? WHERE id_directorio=? AND id_usuario=?`,
      [publico, idDirectorio, idUsuario]
    );

    //actualiza el valor de los permisos de los archivos pertenecientes a la carpeta dada
    const [archivos] = await connection.query(
      `SELECT id_archivo FROM archivos WHERE id_directorio=?`,
      [idDirectorio]
    );
    for (const archivo of archivos) {
      await modificarPermisos(idUsuario, archivo.id_archivo, publico);
    }

    return result.info;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: modificarPermisos del directorio
 * PARÁMETROS: id de usuario, id de Directorio y nuevos permisos.
 * FUNCION:modificar el nombre del directorio*/
const eliminarDirectorio = async (idUsuario, idDirectorio) => {
  let connection;
  try {
    connection = await getDB();

    //FALTAAAAAA.....!!!!!!  CODIGO PARA ELIMINAR TODOS LOS ARCHIVOS QUE CONTIENE ESTE DIRECTORIO
    const [directorio] = await connection.query(
      `DELETE FROM directorios where id_usuario=? AND id_directorio=?
      `,
      [idUsuario, idDirectorio]
    );
    if (directorio.affectedRows === 0) {
      throw generateError('No se ha podido borrar la carpeta', 400);
    }
    return directorio.affectedRows;
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  crearDirectorio,
  buscarDirectorio,
  modificarNombreDirectorio,
  modificarPermisosD,
  eliminarDirectorio,
};
