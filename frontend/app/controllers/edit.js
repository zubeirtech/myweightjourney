import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import mathjs from 'mathjs';
import Ember from 'ember';

export default Controller.extend({

    toastr: service('toast'),
    currentWeight: '',

    init() {
        this._super(...arguments);
        this.goals = ['lose', 'gain'];
        this.units = [{ name: 'metric', value: 'kg, m' }, { name: 'imperial', value: 'lbs, inch' }];
    },

    actions: {
        checkNum() {
            if (isNaN(parseInt(this.model.age))) {
                this.toastr.warning('Please enter number', 'Warning')
                set(this.model, 'age', '');
            }
        },

        async savePerson() {
            this.model.forEach(async model => {
                if (model.name === undefined || model.age === undefined || model.gender === undefined || model.goal === undefined || this.currentWeight === '' || model.height === undefined || model.unit === undefined) {
                    this.toastr.error('Please fill out all fields and check if you have valid number', 'Error');
                } else {
                    if (model.unit === 'metric') {
                        //Save bmi
                        let m = mathjs.evaluate(`${model.height} cm to m`);
                        let bminum = Math.round(mathjs.evaluate(`${this.currentWeight} / ${m.value} ^ 2`))
                        set(model, 'bmi', bminum);
                        //Save dates
                        set(model, 'dates', []);
                        model.dates.pushObject(Date.now());
                        //Save weights
                        set(model, 'weights', []);
                        model.weights.pushObject(parseInt(this.currentWeight));
                        //Save Model
                        await model.save().then(doc => {
                            this.toastr.success('Successfully saved new person', 'Nice!');
                            this.transitionToRoute('dashboard');
                        }).catch(e => {
                            Ember.Logger.error(e);
                        })
                       
                        
                    } else {
                        let bminum = Math.round(mathjs.evaluate(`${this.currentWeight} / ${model.height} ^ 2 * 703`))
                        set(model, 'bmi', bminum);
                        let person = await model.save();
                        if (person) {
                            this.toastr.success('Successfully saved new person', 'Nice!');
                            this.transitionToRoute('dashboard');
                        }
                    }
                }
            });
        }
    }

});
