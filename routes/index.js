const express = require('express');
const asyncHandler = require('express-async-handler');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const bcrypt = require('bcrypt');


const router = express.Router();

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

// models
const User = require('../models/User');
const Person = require('../models/Person');

// token route for auth
router.post('/token', asyncHandler(async (req, res, next) => {
    if (req.body.grant_type === 'password') {
        try {
            const { username, password } = req.body;
            await User.find({ email: username }, (err, docs) => {
                if (docs.length !== 0) {
                    bcrypt.compare(password, docs[0].password, (error, val) => {
                        if (error) {
                            next(error);
                        }
                        if (val) {
                            res.status(200).send('{ "access_token": "secret token"}');
                            next();
                        } else {
                            res.status(400).send('{"error": "invalid_grant"}');
                            next();
                        }
                    });
                } else {
                    res.status(400).send('{"error": "invalid_grant"}');
                    next();
                }
            });
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
}));

// router for registering new user
router.post('/users', asyncHandler((req, res, next) => {
    new JSONAPIDeserializer().deserialize(req.body, async (err, user) => {
        try {
            if (user) {
                const { username, email } = user;
                let { password } = user;

                const findUser = await User.find({ email });

                if (findUser.length > 0) {
                    res.status(404).send('{"error": "E-mail exists already"}');
                    next();
                } else {
                    bcrypt.genSalt(10, (e, salt) => {
                        if (e) {
                            console.log(e);
                        }
                        bcrypt.hash(password, salt, async (error, hash) => {
                            if (error) {
                                next(error);
                            }
                            password = hash;

                            const newUser = new User({
                                username,
                                email,
                                password,
                            });

                            const saveUser = await newUser.save();

                            if (saveUser) {
                                const usersJson = UserSerializer.serialize(saveUser);
                                res.status(200).json(usersJson);
                                next();
                            }
                        });
                    });
                }
            } else {
                console.log(err);
                res.status(500).send(err);
                next();
            }
        } catch (error) {
            next(error);
        }
    });
}));


router.get('/dashboard', asyncHandler(async (req, res, next) => {
    try {
        const persons = await Person.find();
        if (persons) {
            const personsJson = PersonSerializer.serialize(persons);
            res.status(200).send(personsJson);
            next();
        }
    } catch (error) {
        next(error);
    }
}));

module.exports = router;
