import Ember from 'ember';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  model: function(params) { return this.store.find('auth/user'); },

  actions: {
    authenticateUser: function(user) {
      this.get('session').authenticate('authenticator:naive', { user: user });
      return false;
    }
  }
});
