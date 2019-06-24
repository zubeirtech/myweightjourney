const express = require('express');
const asyncHandler = require('express-async-handler');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;


const router = express.Router();
const Person = require('../models/Person');

const UserSerializer = new JSONAPISerializer('user', {
    attributes: ['username', 'email', 'password'],
});

const PersonSerializer = new JSONAPISerializer('person', {
    attributes: [
        'name',
        'gender',
        'bmi',
        'goal',
        'unit',
        'dates',
        'height',
        'weight',
        'age',
    ],
});

router.post('/new', asyncHandler(async (req, res, next) => {
    try {
        console.log(req.body);
        next(req.body);
    } catch (error) {
        next(error);
    }
}));

module.exports = router;
