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
    urlDB = 'mongodb+srv://cafe-users:1234567890@cluster0-zwuxz.mongodb.net/test?retryWrites=true&w=majority'
}


process.env.URLDB = urlDB;


// NF4linvultpfNRd9

//1234567890

//'mongodb+srv://cafe-users:1234567890@cluster0-zwuxz.mongodb.net/test?retryWrites=true&w=majority';
   
    // 'mongodb+srv://cafe-user:10102020@cluster0-zwuxz.mongodb.net/test?retryWrites=true&w=majority';