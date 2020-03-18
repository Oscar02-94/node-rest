'use strict';
// =================================0
// pueto
// =================================0

process.env.PORT = process.env.PORT || 3000;

// =================================0
// entorno
// =================================0

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =================================0
// Vencimiento del token
// =================================0
// 60 segundos *
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN =  60*60*24*30

// =================================0
// semilla
// =================================0
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';




//==================================
//google client
//==================================

process.env.ID_CLIENTE = process.env.ID_CLIENTE || '574434005600-d5q8tr9ej5r0rtl0aavl2lgvcgit2p84.apps.googleusercontent.com'


let urlDB;

if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafes';
    
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;


