const express = require('express');

const fs = require('fs');
const  path = require('path');
const app = express();
const {VerificaTokenImg} = require('../middelware/autenticacio')


app.get('/imagenes/:tipo/:img', VerificaTokenImg, (req, res) => {
    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImagen = path.resolve(__dirname, `../../uploade/${ tipo }/${ img}`);

    if(fs.existsSync(pathImagen) ){
        res.sendFile(pathImagen)
    }else{
        const NoImg = path.resolve(__dirname,'../assets/no-img.jpg');
        res.sendFile(NoImg);
    }


})


module.exports = app;