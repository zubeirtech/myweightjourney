import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import mathjs from 'mathjs';

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
            if (this.model.name === undefined || this.model.age === undefined || this.model.gender === undefined || this.model.goal === undefined || this.currentWeight === '' || this.model.height === undefined || this.model.unit === undefined) {
                this.toastr.error('Please fill out all fields and check if you have valid number', 'Error');
            } else {
                if (this.model.unit === 'metric') {
                    //Save bmi
                    let m = mathjs.evaluate(`${this.model.height} cm to m`);
                    let bminum = Math.round(mathjs.evaluate(`${this.currentWeight} / ${m.value} ^ 2`))
                    set(this.model, 'bmi', bminum);
                    //Save dates
                    set(this.model, 'dates', []);
                    this.model.dates.pushObject(Date.now());
                    //Save weights
                    set(this.model, 'weights', []);
                    this.model.weights.pushObject(parseInt(this.currentWeight));
                    //Save Model
                    await this.model.save()
                    this.toastr.success('Successfully saved new person', 'Nice!');
                    this.transitionToRoute('/dashboard');
                    
                } else {
                    let bminum = Math.round(mathjs.evaluate(`${this.currentWeight} / ${this.model.height} ^ 2 * 703`))
                    set(this.model, 'bmi', bminum);
                    let person = await this.model.save();
                    if (person) {
                        this.toastr.success('Successfully saved new person', 'Nice!');
                        this.transitionToRoute('/dashboard');
                    }
                }
            }
        }
    }

});
