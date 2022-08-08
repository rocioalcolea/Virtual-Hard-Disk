'use strict';
const { comprobarName, generateError, nombreUnico } = require('../../helpers');
const { modificarNombreDirectorio } = require('../../baseDatos/directorios');

const editarNombreC = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { idCarpeta } = req.params;
    const { nuevoNombre } = req.body;

    console.log(idCarpeta);
    //comprueba que existe id carpeta
    if (!idCarpeta) {
      throw generateError(
        'Debes introducir el id de la carpeta a modificar',
        400
      );
    }

    //comprueba que existen y tienen tamaño adecuado el nuevo nombre de carpeta
    await comprobarName(nuevoNombre);
    const nuevoNombreUnivoco = nombreUnico(nuevoNombre);

    //llama a la función de la base de datos que modifica el nombre de la carpeta
    const idModificado = await modificarNombreDirectorio(
      idUsuario,
      idCarpeta,
      nuevoNombre,
      nuevoNombreUnivoco
    );

    res.send({
      status: 'ok',
      message: 'Nombre Carpeta Editado',
      data: [idModificado],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarNombreC;
