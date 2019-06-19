const express = require('express');
const mongoose = require('mongoose');

const app = express();

// DB
mongoose.connect('mongodb://127.0.0.1:27017/myweightjourney', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Bodyparser

app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
