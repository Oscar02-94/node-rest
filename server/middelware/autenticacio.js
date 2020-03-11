'use stick'

const jwt = require('jsonwebtoken');

//==================================
//VERIFICAR TOKEN
//==================================

let verificaToken = (req, res, next) => {
    
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'token no valido'
                }
            });
        }
        
        req.usuario = decoded.Usuario
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