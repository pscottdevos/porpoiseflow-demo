import Ember from 'ember';

export default Ember.Controller.extend({
  defaultUser: function() {
    if (!this.get('session.isAuthenticated')) {
      return null;
    }

    return this.store.find('auth/user', this.get('session.secure.userId'));
  }.property('session.isAuthenticated', 'session.secure.userId')
});
