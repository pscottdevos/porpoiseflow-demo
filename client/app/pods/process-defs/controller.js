import Ember from 'ember';

export default Ember.Controller.extend({
  defaultUser: function() {
    return this.store.find('auth/user', 1);
  }.property()
});
