'use strict';

const { generateError } = require('../../helpers');
const { modificarPermisos } = require('../../baseDatos/archivos');
const editarPermisosA = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreArchivo, nombreCarpeta, publico } = req.body;

    if (!nombreArchivo || !nombreCarpeta || publico === undefined) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }
    const id = await modificarPermisos(
      idUsuario,
      nombreArchivo,
      nombreCarpeta,
      publico
    );
    res.send({
      status: 'ok',
      message: 'Permisos editados',
      data: [id],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarPermisosA;
