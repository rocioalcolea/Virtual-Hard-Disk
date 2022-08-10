'use strict';

const { comprobarName, nombreUnico } = require('../../helpers');
const { crearDirectorio } = require('../../baseDatos/directorios');

const nuevaCarpeta = async (req, res, next) => {
  try {
    //recogemos idUsuario del middleware Propietario
    const idUsuario = req.idPropietario;

    //recogemos el nombre de la carpeta del json
    const { nombreCarpeta } = req.body;

    //Comprobamos que existe nombreCarpeta y cumple con los requisitos
    await comprobarName(nombreCarpeta);

    const nombreUnivoco = nombreUnico(nombreCarpeta);

    //llamo a la función que crea la carpeta en la base de datos
    const id = await crearDirectorio(
      idUsuario,
      nombreUnivoco,
      nombreCarpeta.trim()
    );

    res.send({
      status: 'ok',
      id: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = nuevaCarpeta;
