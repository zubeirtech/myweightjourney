const express = require('express');

const router = express.Router();

// User model
const User = require('../models/User');

// token route for auth
router.post('/token', (req, res) => {

    console.log(req.body);

    if(req.body.grant_type === 'password') {

    } else {
        res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
})