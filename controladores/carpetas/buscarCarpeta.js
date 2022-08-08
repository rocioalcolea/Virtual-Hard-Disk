'use strict';

const { comprobarName, nombreUnico } = require('../../helpers');
const { buscarDirectorio } = require('./../../baseDatos/directorios');

const buscarCarpeta = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreCarpeta } = req.body;

    //compruebo que existe el campo nombreCarpeta
    await comprobarName(nombreCarpeta);

    //guardo el nombre de la carpeta en minúsculas y sin espacios
    const nombreUnivoco = nombreUnico(nombreCarpeta);

    //busco la carpeta con nombre unico
    const result = await buscarDirectorio(idUsuario, nombreUnivoco);

    res.send({
      status: 'ok',
      message: 'Buscando Carpeta...',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = buscarCarpeta;
