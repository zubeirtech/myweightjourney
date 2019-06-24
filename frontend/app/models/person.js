import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    gender: DS.attr('string'),
    bmi: DS.attr('number'),
    goal: DS.attr('string'),
    unit: DS.attr('string'),
    dates: DS.attr('array'),
    height: DS.attr('number'),
    weight: DS.attr('array'),
    age: DS.attr('number')
});
