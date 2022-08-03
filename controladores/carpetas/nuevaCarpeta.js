'use strict';

const { generateError } = require('../../helpers');
const { crearCarpeta } = require('../../baseDatos/directorios');

const nuevaCarpeta = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;

    const { nombreCarpeta } = req.body;

    if (!nombreCarpeta) {
      throw generateError(
        'Debes introducir nombre de carpeta con longitud menor que 100',
        400
      );
    }

    const id = await crearCarpeta(idUsuario, nombreCarpeta);

    res.send({
      status: 'ok',
      message: `Creada Carpeta con id ${id} `,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = nuevaCarpeta;
