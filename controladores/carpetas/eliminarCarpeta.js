'use strict';
const path = require('path');
const fs = require('fs').promises;
const { mostrarFicheros, borrarFichero } = require('../../baseDatos/archivos');
const { eliminarDirectorio } = require('./../../baseDatos/directorios');
const eliminarCarpeta = async (req, res, next) => {
  try {
    const { idCarpeta } = req.params;
    const idUsuario = req.idPropietario;

    const borrar = await mostrarFicheros(idCarpeta, idUsuario);

    if (borrar[1]) {
      const archivosBorrar = [...borrar[1]];

      if (archivosBorrar.length > 0 || archivosBorrar != undefined) {
        //recorro el array de ficheros pertenecientes a la carpeta a borrar
        for (const archivo of archivosBorrar) {
          //borro el fichero en la base de datos
          let ficheroBorrado = borrarFichero(idUsuario, archivo.id_archivo);

          //borro el fichero del servidor
          let path_file = await path.join(
            __dirname,
            `..`,
            `..`,
            `discoDuro`,
            `${idUsuario}`,
            await ficheroBorrado
          );
          await fs.unlink(path_file);
        }
      }
    }
    //elimino de la base de datos la carpeta a eliminar

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
