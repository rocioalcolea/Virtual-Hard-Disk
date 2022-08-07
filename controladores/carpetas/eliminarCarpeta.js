'use strict';
const { eliminarDirectorio } = require('./../../baseDatos/directorios');
const eliminarCarpeta = async (req, res, next) => {
  try {
    const { id_carpeta } = req.params;
    const idUsuario = req.idPropietario;

    //llamar a eliminar archivo por cada archivo que haya en un directorio.
    //seleccionar todos los archivos pertenecientes a un directorio
    //devolver el array
    //con un for  ir llamando a eliminar archivo
    //eliminar carpeta

    const eliminado = await eliminarDirectorio(idUsuario, id_carpeta);
    console.log(eliminado);
    res.send({
      status: 'ok',
      message: 'Eliminar Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    // if (connection) connection.release();
  }
};

module.exports = eliminarCarpeta;
