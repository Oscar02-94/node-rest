'use strict'
const express = require('express');

const { verificaToken } = require('../middelware/autenticacio');

let app = express();

let Producto = require('../../models/producto');

const _ = require('lodash')

const usuario = require('../../models/usuario')

// =================================
// Optener productos
// =================================
 app.get('/productos',verificaToken,(req, res) =>  {
    // traer todos los productos
    // pupulate: tiene que traer usuario y categoria
    // tener paginador
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true})
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .limit(5)
    .exec((err, productos) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            productos
        })
    })

 });


 // =================================
// Optener productos por id
// =================================
app.get('/productos/:id',verificaToken,(req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            console.log(productoDB,'ggggggggggggggg')
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });
});


// =================================
// crear una busqueda por la url
// =================================
app.get('/productos/buscar/:termino', verificaToken,(req, res) => {
// requerimos el termino como lo hacemos con un ide con params
    const termino = req.params .termino;
// usando expresione regulares (regex = exprecionRegular) ( con la i le decimos que sea insencible alas mayusculas y minus.)
    const regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex})
    .populate('categoria', 'nombre')
    .exec(( err, productos) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        })
    })





})


// =================================
// crear los  productos
// =================================
app.post('/productos',verificaToken,(req, res) =>  {
    // grabar el usuario dproducto es como el de la linea 42
    // grabar una categoria del listado
    let body = req.body;
    //let id = req.bo._id
    //console.log(req.usuario._id)
    let producto = new Producto({
        usuario: req.usuario.id,
        nombre: body.nombre, 
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
      
    });

    producto.save((err, productoDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        
        res.status(201).json({
            ok:true,
            producto: productoDB
        });
    });


});

// =================================
// Actualizar productos
// =================================
app.put('/productos/:id',verificaToken,(req, res) =>  {
    // pupulate: tiene que traer usuario y categoria
   // tener paginador
   let id = req.params.id;

   let body = req.body;

   Producto.findById(id, (err, productoDB) => {
     
    if(err) {
        return res.status(500).json({
            ok: false,
            err,
        });
    }

    if(!productoDB) {
        return res.status(400).json({
            ok: false,
            err:{
                message: 'El producto no  exixte'
            }
        });
    }
    // actualizacion del producto
    productoDB.nombre = body.nombre
    productoDB.precioUni = body.precioUni
    productoDB.descripcion = body.descripcion
    productoDB.disponible = body.disponible
    productoDB.categoria = body.categoria
    

    productoDB.save((err, productoGuardado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            producto: productoGuardado
        })
    });

   });

});

// =================================
// Cambiar el estado de del producto a false en db
// =================================
app.delete('/productos/:id',verificaToken,(req, res) =>  {
    // no borrar el producto de la base de datos solo cambiar el estado
    let id = req.params.id;
    
   Producto.findById(id,(err, productoDB) => {
    if(err) {
        return res.status(500).json({
            ok: false,
            err,
        });
    }

    if(!productoDB) {
        return res.status(400).json({
            ok: false,
            err:{
                message:'ID no existe'
            }
        });
    }
    productoDB.disponible = false;

    productoDB.save((err, productoBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message:'Producto borrado'
        });

    });

   });

});







module.exports = app;