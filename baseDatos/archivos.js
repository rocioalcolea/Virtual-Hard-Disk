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
 * PARÁMETROS: id directorio
 * FUNCION: listar ficheros y directorios de dentro de una carpeta*/
const mostrarFicheros = async (idDirectorio, idUsuario) => {
  let connection;

  try {
    connection = await getDB();
    let directorio = [];

    //busco los archivos pertenecientes a esa carpeta
    const [archivos] = await connection.query(
      `SELECT id_archivo, name_real FROM archivos  WHERE id_directorio=? AND id_usuario=?
      `,
      [idDirectorio, idUsuario]
    );

    //busco nobre raiz del directorio pasado por parametro
    const idDir = await buscarNombreRaizbyId(idDirectorio);

    //si el directorio es la raiz, que muestre tambien los directorios dependientes
    if (idDir[0].name == idUsuario.toString()) {
      [directorio] = await connection.query(
        `SELECT id_directorio, name FROM directorios  WHERE name<>? AND id_usuario=?
        `,
        [idDir[0].name, idUsuario]
      );
    }

    //si no hay archivos ni directorios en ese directorio que lance error
    if (archivos[0] === undefined && directorio[0] === undefined) {
      throw generateError('No hay archivos ni carpetas que mostrar', 400);
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

const modificarPermisos = async (
  idUsuario,
  nombreArchivo,
  nombreCarpeta,
  publico
) => {
  let connection;
  try {
    connection = await getDB();
    const [directorio] = await connection.query(
      `SELECT id_directorio FROM directorios where id_usuario=? AND  name=?
      `,
      [idUsuario, nombreCarpeta]
    );
    if (directorio[0] === undefined) {
      throw generateError('Esa carpeta no existe o no le pertenece', 400);
    }

    const idCarpeta = directorio[0].id_directorio;

    const [ArchivoByNombre] = await connection.query(
      `SELECT id_archivo FROM archivos where id_usuario=? AND  name_real=? AND id_directorio=?
      `,
      [idUsuario, nombreArchivo, idCarpeta]
    );

    if (ArchivoByNombre[0] === undefined) {
      throw generateError('Ese archivo no existe o no le pertenece', 400);
    }

    const idArchivo = ArchivoByNombre[0].id_archivo;

    const [result] = await connection.query(
      ` UPDATE archivos SET  publico=? WHERE id_archivo=?`,
      [publico, idArchivo]
    );
    return result;
  } finally {
    if (connection) connection.release();
  }
};
const modificarNombreArchivo = async (
  idUsuario,
  nombreCarpeta,
  nombreArchivo,
  nuevoNombreArchivo
) => {
  let connection;
  try {
    connection = await getDB();
    const [directorio] = await connection.query(
      `SELECT id_directorio FROM directorios where id_usuario=? AND  name=?
      `,
      [idUsuario, nombreCarpeta]
    );
    if (directorio[0] === undefined) {
      throw generateError('Esa carpeta no existe o no le pertenece', 400);
    }

    const idCarpeta = directorio[0].id_directorio;

    const [ArchivoByNombre] = await connection.query(
      `SELECT id_archivo FROM archivos where id_usuario=? AND  name_real=? AND id_directorio=?
      `,
      [idUsuario, nombreArchivo, idCarpeta]
    );

    if (ArchivoByNombre[0] === undefined) {
      throw generateError('Ese archivo no existe o no le pertenece', 400);
    }
    const idArchivo = ArchivoByNombre[0].id_archivo;

    const [archivos] = await connection.query(
      `SELECT id_archivo FROM archivos where id_usuario=? AND id_archivo=? AND id_directorio=?
      `,
      [idUsuario, idArchivo, idCarpeta]
    );

    if (archivos[0] === undefined) {
      throw generateError('Ese archivo no existe', 400);
    }
    const [result] = await connection.query(
      ` UPDATE archivos SET  name_real=? WHERE id_archivo=?`,
      [nuevoNombreArchivo, idArchivo]
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
};
