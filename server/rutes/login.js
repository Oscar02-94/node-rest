'use strict'

const conf  = require('./../config/config');

const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email} ,(err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: true,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(usuario) o contraseña incorrecto'
                }
            });

        }

       if(!bcrypt.compareSync( body.password, usuarioDB.password )) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'usuario o (contraseña) incorrecto'
                }
            });
       }

       let token = jwt.sign({
           // el payload es todo el usuario de db
           Usuario: usuarioDB 
       }, process.env.SEED , { expiresIn:process.env.CADUIDAD_TOKEN});

       res.json({
        ok: true,
        Usuario: usuarioDB,
        token
        });

    });


});


module.exports = app;