'use strict';

const express = require('express');

let { verificaToken, VerficaAdmin_Rol } = require('../middelware/autenticacio');

let app = express();

let Categoria = require('../../models/categoria')

//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria',verificaToken, ( req, res) => {

  Categoria.find({})
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .exec((err, categorias) => {
    if(err) {
      return res.status(500).json({
        ok: true,
        err
      });
    }

    res.json({
      ok: true,
      categorias
    });
  });

});

//=============================
// Mostrar una categoria por id 
//=============================
app.get('/categoria/:id', ( req, res) => {

  const id = req.params.id;

  Categoria.findById(id, (err,  categoriaDB) => {


    if(err) {
      return res.status(500).json({
        ok: true,
        err
      });
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err:{
          message:'El id no es correcto'
        }
      });
    }
    
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  })

});


//=============================
// crea la nueva categoria 
//=============================
app.post('/categoria',verificaToken,(req, res) => {
    // regresa la nueva categoria

    let body = req.body;

     let categoria = new Categoria({
      descripcion: body.descripcion,
      usuario: req.usuario._id
     });

     categoria.save( ( err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }
          if (!categoriaDB) {
            return res.status(400).json({
              ok: false,
              err,
            });
          }
          
          res.json({

            ok: true,
            categoria: categoriaDB
          });
     });

});





//=============================
// Actualizar uan categoria
//=============================
 app.put('/categoria/:id', verificaToken,( req, res) => {

  let id = req.params.id;

  let body = req.body;
  
  // esto seria el body que hay que actualizar
  let desCategoria = {
    descripcion: body.descripcion
  };
 


  Categoria.findByIdAndUpdate( id, desCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
  // si no existe esa categoria manda un erro    
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err:{
          message:'la categoria no existe'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });

    
  });

});



//=============================
// Eliminar una categoria de la base de datos definitivamente
//=============================

// que solo lo borre si el usuario es administrador
app.delete('/categoria/:id',[verificaToken, VerficaAdmin_Rol], ( req, res) => {

  let id = req.params.id;
  Categoria.findOneAndDelete(id, (err, categoriaBorrada) => {
    
    if( err) {
      return res.status(400).json({
        ok: true,
        err,
      });
    };
      if(!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          error:{
            message:'la categoria no existe'
          },
        });
      }
      res.json({
        ok: true,
        message:'la categoria fue eliminada',
        categoriaBorrada
      });

    
  });

});







module.exports = app;