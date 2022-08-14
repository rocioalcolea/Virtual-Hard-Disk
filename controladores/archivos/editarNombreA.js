'use strict';
const { generateError, comprobarName } = require('../../helpers');
const { modificarNombreArchivo } = require('../../baseDatos/archivos');
const editarNombreA = async (req, res, next) => {
  try {
    //recojo valores
    const idUsuario = req.idPropietario;
    const { id_archivo } = req.params;
    const { nuevoNombreArchivo } = req.body;

    //compruebo que se envia los datos necesarios
    await comprobarName(nuevoNombreArchivo);
    if (!id_archivo) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }

    //llamo a funcion que modifica el nombre del archivo en la base de datos
    const id = await modificarNombreArchivo(
      idUsuario,
      id_archivo,
      nuevoNombreArchivo
    );

    res.send({
      status: 'ok',
      message: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarNombreA;
