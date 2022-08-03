'use strict';

const crearCarpeta = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    console.log('usuario', idUsuario);
    res.send({
      status: 'ok',
      message: 'Crear Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = crearCarpeta;
