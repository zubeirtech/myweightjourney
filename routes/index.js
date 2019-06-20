const express = require('express');
const asyncHandler = require('express-async-handler');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const bcrypt = require('bcrypt');


const router = express.Router();

// User model
const User = require('../models/User');

// token route for auth
router.post('/token', asyncHandler(async (req, res, next) => {
    if (req.body.grant_type === 'password') {
        try {
            const { username, password } = req.body;
            await User.find({ email: username }, (err, docs) => {
                console.log(docs);
                if (docs.length !== 0) {
                    // eslint-disable-next-line max-len
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
    const UserSerializer = new JSONAPISerializer('user', {
        attributes: ['username', 'email', 'password'],
    });

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


module.exports = router;
