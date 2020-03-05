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
// base de datos
// =================================0

let urlDB;

if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafes';
    
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;


