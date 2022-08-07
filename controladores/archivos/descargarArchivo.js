'use strict';
//const download = require('download');
const path = require('path');
//const Downloader = require('nodejs-file-downloader');
//const https = require('https');
//const fs = require('fs');
const descargarArchivo = async (req, res, next) => {
  try {
    // Url of the image

    const file = path.join(
      `${__dirname}`,
      `..`,
      `..`,
      `discoDuro/4/222ad1fc-4bc5-44a9-a97d-1d6cfd51d5e7.jpeg`
    );

    // Path at which image will get downloaded
    const filePath = `${__dirname}`;

    res.download(file, `${filePath}que bonito.pdf`, (err) => {
      if (err) {
        console.log('error', res.headersSent);
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
      } else {
        console.log('no error');
        // decrement a download credit, etc.
      }
    });

    /*   const downloader = new Downloader({
      url: file,
      directory: filePath,
    });
    try {
      await downloader.download(); //Downloader.download() resolves with some useful properties.

      console.log('All done');
    } catch (error) {
      console.log('Download failed', error);
    } */
    /*
    const writeStream = fs.createWriteStream(file);

    req.pipe(writeStream);
    await download(file, filePath);

    writeStream.on('finish', () => {
      writeStream.close();
      console.log('Download Completed');
    }); */

    //await download(file, filePath);

    res.send({
      status: 'ok',
      message: 'Descargar Archivo',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = descargarArchivo;
