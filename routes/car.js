'use strict';
const mongoose = require('mongoose');
const express = require('express');
const Car  = require('../models/car');
const Role  = require('../helpers/role');
const autorize  = require('../middleware/role');
const auth  = require('../middleware/auth');
const {Company}  = require('../models/company');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');

router.get('/', [auth, autorize([Role.Admin])], async(req, res) => {
    const cars = await Car
        .find();

        /* BASE NORMALIZADA .populate('company', 'name country'); */
    res.status(200).send(cars);
});

router.get('/:id', async(req, res) => {
    const car= await Car.findById(req.params.id);
    if(!car)return res.status(404).send('El coche con el Id '+req.params.id+' no existe');
    res.status(200).send(car);
});


//Post modelo datos embebido

router.post('/', 
[
    check('year').isLength({min:3}),
    check('model').isLength({min:3})
],
async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const company = await Company.findById(req.body.companyId);
    if(!company) return res.status(400).send('No tenemos ese fabricante');

    const car = new Car({
        company: company,
        model: req.body.model,
        sold: req.body.sold,
        year: req.body.year,
        price: req.body.price,
        extras: req.body.extras
    });

    const resul = await car.save();
    res.status(201).send(resul);
});
//Post modelo normalizado

/* router.post('/', 
[
    check('model').isLength({min:3})
],
async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const car = new Car({
        company: req.body.company,
        model: req.body.model,
        sold: req.body.sold,
        year: req.body.year,
        price: req.body.price,
        extras: req.body.extras
    });

    const resul = await car.save();
    res.status(201).send(resul);
}); */


router.put('/:id', 
[
    check('model').isLength({min:3})
],
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const car = await Car.findByIdAndUpdate(req.params.id,{
        company: req.body.company,
        model: req.body.model,
        sold: req.body.sold,
        year: req.body.year,
        price: req.body.price,
        extras: req.body.extras
    }, {
        new: true
    });
    if(!car){
        return res.status(404).send('El coche con ese Id no existe');
    }
    res.status(204).send();
});

router.delete('/:id', async(req, res) => {
    const car = await Car.findByIdAndDelete(req.params.id);
    if(!car){
        res.status(404).send('El coche con ese Id no existe');
        return;
    }
    res.status(200).send('coche borrado');
});

module.exports = router;