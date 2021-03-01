'use strict';

const mongoose =  require('mongoose');
const express = require('express');
const app = express();
const car = require('./routes/car');
const user = require('./routes/user');
const company = require('./routes/company');
const sale = require('./routes/sale');
const auth = require('./routes/auth');
app.use(express.json());
app.use('/api/cars', car);
app.use('/api/users', user);
app.use('/api/company/', company)
app.use('/api/sale/', sale)
app.use('/api/auth/', auth)
const port = process.env.PORT || 3003;
app.listen(port, () => console.log('escuchando puerto ' + port));
console.log(process.env.SECRET_KEY_JWT_CAR_API);
mongoose.connect('mongodb://localhost/carsdb',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
    .then(()=> console.log('Conectado correctamente a MongoDB'))
    .catch(()=> console.log('Error al conectarse a MongoDB'));