'use strict'

const conf  = require('./../config/config');

const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.ID_CLIENTE);




const Usuario = require('../../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err) {
            return res.status(500).json({
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
           usuario: usuarioDB 
       }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN});

       res.json({
        ok: true,
        usuario: usuarioDB,
        token
        });

    });


});


// configuracion de google autenticacion


async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.ID_CLIENTE,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //console.log(payload.name);
  //console.log(payload.email);
  //console.log(payload.picture);

  return {
      nombre: payload.name,
      email: payload.email,
      img: payload.picture,
      google: true
  }
  
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

   let googleUser = await verify(token)
   .catch( e => {
       return res.status(403).json({
           ok: false,
           err: e
       });
   });

   Usuario.findOne( { email: googleUser.email}, (err, usuarioDB) => {
       // busco en mi base de datos si ya hay un usuario con este correo
    if(err) {
        return res.status(500).json({
            ok: true,
            err
        });
    };

    if(usuarioDB) {
        if(usuarioDB.google === false) {
            return res.status(400).json({
                ok: true,
                err:{
                    message:'Debe de usar  su autenticacion normal'
                }
            });

        }else{
            let token = jwt.sign({
                Usuario : usuarioDB
            },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        }
       
    }else{
     // si el usuario no existe en nuestra base de  datos
        let usuario = new Usuario();
        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.img = googleUser.img;
        usuario.google = true;
        usuario.password = ':)';
        
        usuario.save((err, usuarioDB) => {
            if(err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            };
            let token = jwt.sign({
                Usuario : usuarioDB
            },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        });

    }

   });

   // res.json({
     //   usuario: googleUser
    //});

});

module.exports = app;