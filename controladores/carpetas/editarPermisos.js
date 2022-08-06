'use strict';

const { generateError } = require('../../helpers');
const { modificarPermisos } = require('../../baseDatos/directorios');
const editarPermisos = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreCarpeta, publico } = req.body;

    if (!nombreCarpeta || !publico) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }
    const id = await modificarPermisos(idUsuario, nombreCarpeta, publico);

    res.send({
      status: 'ok',
      message: 'Editar Permisos Carpeta',
      data: [id],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarPermisos;
