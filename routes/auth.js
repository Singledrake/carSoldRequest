'use strict';
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const User  = require('../models/user');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');

router.post('/', 
[
    check('email').isLength({min:3}),
    check('password').isLength({min:3})
],
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Usuario o contraseña incorrecto');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Usuario o contraseña incorrecto');
    const jwtToken = user.generateJWT();
    res.status(201).header('Authorization', jwtToken).send({
        _id: user._id,
        name: user.name,
        email: user.email,
    });
    
});

module.exports = router;