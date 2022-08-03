'use strict';
const { generateError } = require('../../helpers');
const { modificarNombreCarpeta } = require('../../baseDatos/directorios');

const editarNombreC = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreCarpeta, nuevoNombreCarpeta } = req.body;

    if (!nombreCarpeta || !nuevoNombreCarpeta) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }
    const id = await modificarNombreCarpeta(
      idUsuario,
      nombreCarpeta,
      nuevoNombreCarpeta
    );
    console.log(id);

    res.send({
      status: 'ok',
      message: 'Editar Nombre Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarNombreC;
