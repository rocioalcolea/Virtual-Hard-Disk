'use strict';

const { generateError } = require('../helpers');

const getDB = require('./db');

//funcion para buscar el nombre de la carpeta raiz.
const buscarNombreRaizbyId = async (id) => {
  let connection2;
  try {
    connection2 = await getDB();

    const [nombre] = await connection2.query(
      `SELECT name FROM directorios WHERE id_directorio=?`,
      [id]
    );
    if (nombre[0] === undefined) {
      throw generateError('no existe ese id', 400);
    }
    return nombre;
  } finally {
    if (connection2) connection2.release();
  }
};

/**NOMBRE: subir fichero
 * PARÁMETROS: id de usuario,nombre real del archivo, nombre encriptado del archivo, id del directorio
 * si no tiene nombre que escriba root y permisos, por defecto false.
 * FUNCION:subir fichero a directorio indicado o por defecto el raiz*/
const subirArchivo = async (
  idUsuario,
  idDirectorio,
  nombreRealFichero,
  nombreArchivoEncriptado,
  publico = false
) => {
  let connection;
  try {
    connection = await getDB();
    //busco un archivo con ese nombre, en ese directorio y que pertenezca a ese usuario
    const [directorio] = await connection.query(
      `SELECT id_archivo FROM archivos  WHERE id_usuario=? AND name_real=? AND id_directorio=?
        `,
      [idUsuario, nombreRealFichero, idDirectorio]
    );

    //si existe ese fichero lanzo error, para evitar duplicados.
    if (directorio[0] != undefined) {
      throw generateError('Ese nombre de fichero ya existe en la carpeta', 400);
    }

    //busco el dueño del directorio para comprobar que el fichero solo sube a las carpetas de ese usuario
    const [usuario] = await connection.query(
      `SELECT id_usuario FROM directorios  WHERE id_directorio=?
        `,
      [idDirectorio]
    );

    if (idUsuario !== usuario[0].id_usuario) {
      throw generateError('La carpeta no pertenece al usuario actual', 400);
    }
    //añado el nombre de fichero a la base de datos con el resto de los campos.
    const [archivo] = await connection.query(
      ` INSERT INTO archivos (id_usuario, id_directorio,name_real, name_encriptado,publico) VALUES (?,?,?,?,?)`,
      [
        idUsuario,
        idDirectorio,
        nombreRealFichero,
        nombreArchivoEncriptado,
        publico,
      ]
    );

    return archivo.insertId;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: mostarFicheros
 * PARÁMETROS: id directorio, id usuario
 * FUNCION: listar ficheros y directorios de dentro de una carpeta*/
const mostrarFicheros = async (idDirectorio, idUsuario) => {
  let connection;

  try {
    connection = await getDB();
    let directorio = [];

    //busco los archivos pertenecientes a esa carpeta
    const [archivos] = await connection.query(
      `SELECT id_archivo, name_real, id_directorio FROM archivos  WHERE id_directorio=? AND id_usuario=?
      `,
      [idDirectorio, idUsuario]
    );

    //busco nobre raiz del directorio pasado por parametro
    const idDir = await buscarNombreRaizbyId(idDirectorio);

    //si el directorio es la raiz, que muestre tambien los directorios dependientes
    if (idDir[0].name === idUsuario.toString()) {
      [directorio] = await connection.query(
        `SELECT id_directorio, name FROM directorios  WHERE name<>? AND id_usuario=?
        `,
        [idDir[0].name, idUsuario]
      );
    }

    //si no hay archivos ni directorios en ese directorio que lance error
    if (archivos[0] === undefined && directorio[0] === undefined) {
      return [];
    }

    //creo result con todos los directorios y archivos encontrados en esa carpeta
    const result = [];
    result[0] = [...directorio];
    result[1] = [...archivos];

    return result;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: borrarFicheros
 * PARÁMETROS: idUsuario, id directorio, id archivo
 * FUNCION: borrar fichero*/

const borrarFichero = async (idUsuario, idArchivo) => {
  let connection;

  try {
    connection = await getDB();
    //recojo el nombre encriptado que devuelvo para borrar el fichero del servidor
    const [archivo] = await connection.query(
      `SELECT name_encriptado FROM archivos WHERE id_usuario=? AND id_archivo=? 
      `,
      [idUsuario, idArchivo]
    );
    console.log(archivo);
    if (archivo[0] === undefined) {
      throw generateError('No existe el fichero que se desea eliminar', 400);
    }
    //borro el fichero de la base de datos
    try {
      await connection.query(
        `DELETE FROM archivos WHERE  id_usuario=? AND id_archivo=? 
      `,
        [idUsuario, idArchivo]
      );
    } catch (error) {
      throw generateError(
        'Error al borrar el fichero en la base de datos',
        400
      );
    }
    //devuelvo nombre encriptado
    return archivo[0].name_encriptado;
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: modificarPersmisos
 * PARÁMETROS: idUsuario, id directorio, id archivo y permisos
 * FUNCION: modificar fichero*/
const modificarPermisos = async (idUsuario, idArchivo, publico) => {
  let connection;
  try {
    connection = await getDB();
    const [archivo] = await connection.query(
      ` SELECT name_real FROM archivos WHERE id_archivo=? AND id_usuario=?`,
      [idArchivo, idUsuario]
    );

    if (archivo[0] === undefined) {
      throw generateError(
        'No se ha encontrado el archivo o no le pertenece',
        400
      );
    }

    const [result] = await connection.query(
      ` UPDATE archivos SET  publico=? WHERE id_archivo=? AND id_usuario=?`,
      [publico, idArchivo, idUsuario]
    );

    if (result.affectedRows === 0) {
      throw generateError('No se ha podido modificar el fichero', 400);
    }
    return 'los permisos del fichero se ha modificado';
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: modificarNombreArchivo
 * PARÁMETROS: idUsuario, id archivo, nombre del nuevo archivo
 * FUNCION: modificar nombre fichero*/
const modificarNombreArchivo = async (
  idUsuario,
  idArchivo,
  nuevoNombreArchivo
) => {
  let connection;
  try {
    connection = await getDB();
    const [archivo] = await connection.query(
      ` SELECT name_real FROM archivos WHERE id_archivo=? AND id_usuario=?`,
      [idArchivo, idUsuario]
    );

    if (archivo[0] === undefined) {
      throw generateError(
        'No existe el archivo a modificar o no le pertenece',
        400
      );
    }

    //recojo el archivo, separo la extensión y se la añado al nuevo nombre
    //para que pueda cambiar el nombre pero no la extensión del fichero
    const nombreArchivo = archivo[0].name_real.split('.');
    const extension = nombreArchivo[nombreArchivo.length - 1];
    nuevoNombreArchivo = nuevoNombreArchivo + '.' + extension;

    //actualiza el nombre real al nuevo nombre introducido
    const [result] = await connection.query(
      ` UPDATE archivos SET  name_real=? WHERE id_archivo=? AND id_usuario=?`,
      [nuevoNombreArchivo, idArchivo, idUsuario]
    );

    if (result.affectedRows === 0) {
      throw generateError('No se ha podido modificar el fichero ', 400);
    }
    return 'el nombre de fichero se ha modificado';
  } finally {
    if (connection) connection.release();
  }
};

/**NOMBRE: buscarArchivoId
 * PARÁMETROS:id archivo
 * FUNCION: buscar un fichero a través de su id*/
const buscarArchivoId = async (idArchivo) => {
  let connection;
  try {
    connection = await getDB();
    //me selecciona el nombre real, el encriptado y el id del propitario.
    const [result] = await connection.query(
      ` SELECT name_real, name_encriptado,publico,id_directorio,id_usuario FROM archivos WHERE  id_archivo=?`,
      [idArchivo]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  subirArchivo,
  mostrarFicheros,
  borrarFichero,
  modificarPermisos,
  modificarNombreArchivo,
  buscarArchivoId,
};
