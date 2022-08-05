'use strict';
const path = require('path');
const { borrarFichero } = require('../../baseDatos/archivos');
const fs = require('fs').promises;

const eliminarArchivo = async (req, res, next) => {
  try {
    const { nombreCarpeta, nombreFichero } = req.body;
    const idPropietario = req.idPropietario;

    const ficheroBorrado = await borrarFichero(
      idPropietario,
      nombreCarpeta,
      nombreFichero
    );

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
