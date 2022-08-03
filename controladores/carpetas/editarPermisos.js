'use strict';

const editarPermisos = async (req, res, next) => {
  console.log('entra aqui');
  try {
    res.send({
      status: 'ok',
      message: 'Editar Permisos Carpeta',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editarPermisos;
