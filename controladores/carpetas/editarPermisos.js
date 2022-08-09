'use strict';

const { generateError } = require('../../helpers');
const { modificarPermisosD } = require('../../baseDatos/directorios');
const editarPermisos = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { publico } = req.body;
    const { idCarpeta } = req.params;

    //comprueba que existe id carpeta y que existen los permisos
    if (!idCarpeta || publico === undefined) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100 y un valor para los permisos',
        400
      );
    }
    const id = await modificarPermisosD(idUsuario, idCarpeta, publico);

    res.send({
      status: 'ok',
      message: 'Permisos de Carpeta Editados',
      data: [id],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarPermisos;
