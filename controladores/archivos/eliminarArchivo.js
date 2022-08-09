'use strict';
const path = require('path');
const { borrarFichero } = require('../../baseDatos/archivos');
const { generateError } = require('../../helpers');
const fs = require('fs').promises;

const eliminarArchivo = async (req, res, next) => {
  try {
    //recojo los datos
    const idPropietario = req.idPropietario;
    const { id_archivo } = req.params;

    if (!id_archivo) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }
    //llamo a la función que borra de la base de datos el fichero
    const ficheroBorrado = await borrarFichero(idPropietario, id_archivo);

    //borro el fichero del servidor
    const path_file = path.join(
      __dirname,
      `..`,
      `..`,
      `discoDuro`,
      `${idPropietario}`,
      ficheroBorrado
    );

    await fs.unlink(path_file);

    res.send({
      status: 'ok',
      message: 'Archivo eliminado',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = eliminarArchivo;
