import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// import { set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {

    async model() {
        const Person = await this.store.findAll('person');
        return Person;
    }
});
