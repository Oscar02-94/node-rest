'use strict';


  require('./config/config');
const express = require('express');

const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// rutas de usuarios
app.use(require('./rutes/usuario'));
// ============
// db
// ============
//mongoose.connect

const fazzz = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true};
mongoose.connect( process.env.URLDB , fazzz, (err, res) => {
  if(err) throw err;
  console.log('db is connect');
});

// mongoose.set('useFindAndModify', false);
// ==================
// server
// ==================
app.listen(process.env.PORT, () => {
  console.log('escuchando en el puerto:', process.env.PORT);
});