'use strict';

const { format } = require('date-fns');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

const { UPLOAD_DIRECTORY } = process.env;

const staticDir = path.join(__dirname, UPLOAD_DIRECTORY);

function formatDateToDB(dateObject) {
  return format(dateObject, 'yyyy-MM-dd HH:mm:ss');
}

async function savePhoto(dataPhoto) {
  await fs.access(staticDir);

  // voy a leer la imagen con sharp
  const imagen = sharp(dataPhoto.data);

  // genero un nombre unico para la imagen
  //upload_UUID_nombreoriginal
  const photoName = `upload_${uuid.v4()}_${dataPhoto.name}`;

  // guardo el file (buffer) en static/
  await imagen.toFile(path.join(staticDir, photoName));

  // devuelvo el nombre del file
  return photoName;
}

module.exports = { formatDateToDB, savePhoto };
