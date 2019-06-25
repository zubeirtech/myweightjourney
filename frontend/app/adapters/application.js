import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    session: service(),
    authorize(xhr) {
        let { access_token } = this.get('session.data.authenticated');
        if (isPresent(access_token)) {
          xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
        }
    },
    host: "http://localhost:3000",
});
