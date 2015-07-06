import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function(data) {
    return Ember.RSVP.resolve(data);
  },

  authenticate: function(options) {
    var data = { userId: options.user.id };
    
    return Ember.RSVP.resolve(data);
  },

  invalidate: function(data) {
    return Ember.RSVP.resolve();
  }
});
