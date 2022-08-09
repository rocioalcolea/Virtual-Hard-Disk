'use strict';

const { generateError } = require('../../helpers');
const { modificarPermisosD } = require('../../baseDatos/archivos');
const editarPermisosA = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { publico } = req.body;
    const { id_archivo } = req.params;
    console.log(idUsuario, publico, id_archivo);

    //comprueba que se han pasado los datos de id_archivo y publico
    if (!id_archivo || publico === undefined) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }

    //llama a la función que modifica los permisos en la base de datos
    const id = await modificarPermisosD(idUsuario, id_archivo, publico);

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
