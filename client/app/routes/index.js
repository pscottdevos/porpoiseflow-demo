import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) { return this.store.find('auth/user'); },

  actions: {
    authenticateUser: function(user) {
      this.get('session').authenticate('authenticator:naive', { user: user });
      return false;
    }
  }
});
