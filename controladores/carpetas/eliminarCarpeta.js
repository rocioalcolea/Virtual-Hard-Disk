'use strict';
const { eliminarDirectorio } = require('./../../baseDatos/directorios');
const eliminarCarpeta = async (req, res, next) => {
  try {
    const { idCarpeta } = req.params;
    const idUsuario = req.idPropietario;
    console.log(idCarpeta, idUsuario);

    //llamar a eliminar archivo por cada archivo que haya en un directorio.
    //seleccionar todos los archivos pertenecientes a un directorio
    //devolver el array
    //con un for  ir llamando a eliminar archivo
    //eliminar carpeta

    const eliminado = await eliminarDirectorio(idUsuario, idCarpeta);

    res.send({
      status: 'ok',
      message: 'Eliminar Carpeta',
      data: [eliminado],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = eliminarCarpeta;
