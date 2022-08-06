'use strict';
const { generateError } = require('../../helpers');
const { modificarNombreArchivo } = require('../../baseDatos/archivos');
const editarNombreA = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreCarpeta, nombreArchivo, nuevoNombreArchivo } = req.body;

    if (!nombreCarpeta || !nombreArchivo || !nuevoNombreArchivo) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }
    const id = await modificarNombreArchivo(
      idUsuario,
      nombreCarpeta,
      nombreArchivo,
      nuevoNombreArchivo
    );

    res.send({
      status: 'ok',
      message: 'Editar Nombre Archivo',
      data: [id],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarNombreA;
