import Controller from '@ember/controller';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';


export default Controller.extend({
    toastr: service('toast'),
    media: service(),

    init() {
        this._super(...arguments);
        this.message = [];
    },

    validate(email) {
        // eslint-disable-next-line no-useless-escape
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    actions: {
        async register() {
            if(!this.username || !this.email || !this.password || !this.secondPassword) {
                this.toastr.error("Please fill in all fields", "Error");
            } else {
                if (this.password !== this.secondPassword) {
                    this.toastr.error("Password don't match", "Error");
                } else {
                    try {
                        const validation = this.validate(this.email);
                        if (validation) {
                            set(this.model, 'username', this.username);
                            set(this.model, 'email', this.email);
                            set(this.model, 'password', this.password);
                            await this.model.save()
                              .then(doc => {
                                  if (doc) {
                                      this.toastr.success("Successfully added user", "Congratulations");
                                      this.transitionToRoute('login');
                                  }
                              })
                              .catch(e => {
                                  Ember.Logger.warn(e);
                                  if(e.errors[0].status === "404") {
                                      this.toastr.error("Email already exists, please use different email", "Error");                            
                                  }
                              })

                            
                        } else {
                            this.toastr.error("Please use valid email", "Error");
                        }

                    } catch (e) {
                        throw new e;
                    }
                }
            }
        }
    }
});
