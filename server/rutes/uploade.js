const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
//  moodelo usuario
const Usuario = require('../../models/usuario');
const Producto = require('../../models/producto');
// importando el filesystem y el path
const fs = require('fs');
const path = require('path');


// default options este midelware lo que hace es que todos los archuvos cargados caen en en req.files para pder guadarlos en una carpeta en este caso uploader
app.use(fileUpload());

app.put('/uploade/:tipo/:id', (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;
    if (!req.files){
        
        return res.status(400).json({
            ok: false,
            err: {
                messaje: ' no se a seleccionado ningun archivo'
            }
        });
    }

    // validando  tipos

     const validarTipo = ['productos', 'usuarios'];
    if( validarTipo.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                messaje:'el tipo permitido es ' + validarTipo.join(', ')
            }
        })
    }



    const archivo = req.files.archivo;
    const nombreCortado = archivo.name.split('.');

    // con esto optenemos la ultima pocicion que sera la extencion aqui decimos que de extencion quireo el nombrecortado que sera lo ultimo en este caso la extencion
    const extension = nombreCortado[nombreCortado.length -1];
    console.log(extension);
    
    // extenciones permitidas 
    const extencionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
// coprobacion de extencion sea correcta el indexOf sirve para buscar en el arrai en este casa buscamos en el array de extencionesPermitidas.
    if(extencionesPermitidas.indexOf( extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messaje: 'las extenciones permitadas son ' +  extencionesPermitidas.join(', '),
                ext: extension
                // nos indica que la extencion que subimos no es permitida
            }
        })
    }
// cambiando el nombre del archivo usando los milisegundos
    const nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;



// en este punto la imagen ya esta cargada
// subiendo el archivo con su propio nombre  lo metemos en template string y le pasamos el archivo.name el archivo viene del (.req ) que es el archivo que se manda 
    archivo.mv(`uploade/${ tipo }/${nombreArchivo}`,(err) => {
        if (err)
          return res.status(500).json({
              ok: false,
              err
          });

     // aqui, imagen cargada
     if( tipo === 'usuarios'){
        imagenUsuario(id, res, nombreArchivo); 
     }else{ 
        imagenProducto(id, res, nombreArchivo);
     }
       
      });
});


function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) => {
        if(err){

            borrarArchivo(nombreArchivo, 'usuarios')
            
            return res.status(500).json({
                ok: false, 
                err
            });
        }
        if(!usuarioDB){

            borrarArchivo(nombreArchivo, 'usuarios')

            return res.status(400).json({
                ok: false,
                err: {
                    message:'El usuario no existe'
                }
            });
        }

        // const pathImagen = path.resolve(__dirname, `../../uploade/usuarios/${ usuarioDB.img}`);
        // if(fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }
        borrarArchivo(usuarioDB.img, 'usuarios')


            
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
             res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });
        });
        
    });
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) =>{
        if(err) {
            borrarArchivo(nombreArchivo, 'productos')

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){

            borrarArchivo(nombreArchivo, 'productos')

            return res.status(400).json({
                ok: false,
                err: {
                    message:'El producto no existe'
                }
            });
        }
        
        borrarArchivo(productoDB.img, 'productos')
            
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) =>{
            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });
        })
    });
}




// funcion de eliminar contacto
function borrarArchivo(nombreImagen, tipo){
    const pathImagen = path.resolve(__dirname, `../../uploade/${ tipo }/${ nombreImagen}`);
    if(fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;