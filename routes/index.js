const express = require('express');
const asyncHandler = require('express-async-handler');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;


const router = express.Router();

// User model
const User = require('../models/User');

// token route for auth
router.post('/token', asyncHandler(async (req, res, next) => {
    if (req.body.grant_type === 'password') {
        const { email, password } = req.body;

        const user = await User.find({ email, password });

        if (user) {
            res.status(200).send('{ "access_token": "secret token"}');
            next();
        } else {
            res.status(400).send('{"error": "invalid_grant"}');
            next();
        }
    } else {
        res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
}));

// router for registering new user
router.post('/users', asyncHandler((req, res, next) => {
    const UserSerializer = new JSONAPISerializer('user', {
        attributes: ['username', 'email', 'password'],
    });

    new JSONAPIDeserializer().deserialize(req.body, async (err, user) => {
        if (user) {
            const { username, email, password } = user;
            const newUser = [{ username, email, password }];

            const insertUser = await User.insertMany(newUser);

            if (insertUser) {
                const usersJson = UserSerializer.serialize(insertUser);
                res.status(200).json(usersJson);
                next();
            }
        } else {
            console.log(err);
            res.status(500).send(err);
            next();
        }
    });
}));


module.exports = router;
