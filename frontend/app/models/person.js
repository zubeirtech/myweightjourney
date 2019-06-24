import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    age: DS.attr('number'),
    gender: DS.attr('string'),
    bmi: DS.attr('number'),
    goal: DS.attr('string'),
    unit: DS.attr('string'),
    dates: DS.attr('array'),
    height: DS.attr('number'),
    weights: DS.attr('array'),
});
