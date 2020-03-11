'use strict';

const express = require('express');

const bcrypt = require('bcrypt');
// importando onderscore
const _ = require('underscore');

const app = express();

const Usuario = require('../../models/usuario');

//mideelware de autenticacion
const { verificaToken, VerficaAdmin_Rol} = require('../middelware/autenticacio');

app.get('/usuario', verificaToken, (req, res) => {
   
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado: true}, 'nombre email img role estado google')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      Usuario.count({ estado: true}, (err, conteoDeUSers) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteoDeUSers,
        });
      });
    });
});

app.post('/usuario', [verificaToken, VerficaAdmin_Rol], (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    // encriptando la contraseña
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put('/usuario/:id', [verificaToken, VerficaAdmin_Rol],(req, res)  => {
  let id = req.params.id;
  let body = _.pick(req.body,  ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}
    , (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    });
});

app.delete('/usuario/:id',[verificaToken, VerficaAdmin_Rol], (req, res) => {
  let id = req.params.id;

  let cambiaEstado = {
    estado: false,
  };
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    };
    // validando que el user fue eliminado
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'el usuario no existe, fue eliminado',
        },
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado,
    });
  });
});

module.exports = app;
