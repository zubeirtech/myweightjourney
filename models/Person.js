const mongoose = require('mongoose');

const DateSchema = new mongoose.Schema({ name: Number });

const WeightSchema = new mongoose.Schema({ name: Number });

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
    dates: [Number],
    height: {
        type: Number,
        required: true,
    },
    weights: [Number],
    age: {
        type: Number,
        required: true,
    },
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
