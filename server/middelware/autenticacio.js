'use stick'

const jwt = require('jsonwebtoken');

//==================================
//VERIFICAR TOKEN
//==================================

let verificaToken = (req, res, next) => {
    
    let token = req.get('token'); //con este let token = req.get('token') es para saver  puedo acceder al header donde esta alojado el

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'token no valido'
                }
            });
        }
        
        req.usuario = decoded.usuario
        // console.log(decoded.usuario,'=========>')
        //console.log(decoded);
        next();
        
    })


   // console.log('toke:',token)

};



//==================================
//VERIFICA ADMIN_ROL
//==================================

let VerficaAdmin_Rol =(req, res, next) => {
    
    let usuario = req.usuario;

    if ( usuario.role ==='ADMIN_ROLE' ) {
        next();
    }else{
        res.json({
            ok: false,
            err: {
                message:'el usuario no es administrador'
            }

        });
    }
   
    
};






module.exports ={
    verificaToken,
    VerficaAdmin_Rol
}