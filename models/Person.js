const mongoose = require('mongoose');

const DateSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});

const WeightSchema = new mongoose.Schema({
    weight: {
        type: Number,
        require: true,
    },
});

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    bmi: {
        type: Number,
        required: true,
    },
    goal: {
        type: String,
        enum: ['lose', 'gain'],
        required: true,
    },
    unit: {
        type: String,
        enum: ['metric', 'imperial'],
        required: true,
    },
    dates: {
        type: [DateSchema],
        required: true,
    },
    height: {
        type: [WeightSchema],
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
