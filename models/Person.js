const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Edit name',
    },
    gender: {
        type: String,
        required: true,
        default: 'Edit gender',
    },
    bmi: {
        type: Number,
        required: true,
        default: 0,
    },
    goal: {
        type: String,
        enum: ['lose', 'gain'],
        required: true,
        default: 'lose',
    },
    unit: {
        type: String,
        enum: ['metric', 'imperial'],
        required: true,
        default: 'metric',
    },
    dates: [Number],
    height: {
        type: Number,
        required: true,
        default: 0,
    },
    weights: [Number],
    age: {
        type: Number,
        required: true,
        default: 0,
    },
    email: {
        type: String,
        required: true,
    },
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
