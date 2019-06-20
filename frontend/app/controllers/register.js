import Controller from '@ember/controller';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    toastr: service('toast'),

    init() {
        this._super(...arguments);
        this.message = [];
    }, 

    actions: {
        async register() {
            if(!this.username || !this.email || !this.password || !this.secondPassword) {
                this.message.pushObject('Please fill in all fields')
                if (this.password === this.secondPassword) {
                    this.message.pushObject('The Passwords dont match')
                }
            } else {
                if (this.password === this.secondPassword) {
                    this.message.pushObject('The Passwords dont match')
                } else {
                    try {
                        set(this.model, 'username', this.username);
                        set(this.model, 'email', this.email);
                        set(this.model, 'password', this.password);
                        const user = await this.model.save();
                        if (user) {
                            this.toastr.success('Successfully added user', 'Congratulations!');
                        }
                    } catch (e) {
                        console.log(e);
                        this.toastr.error(e, 'Error!');
                    }
                }
            }
        }
    }
});
