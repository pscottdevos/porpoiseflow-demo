import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    return Ember.RSVP.resolve(data);
  },

  authenticate(options) {
    return Ember.RSVP.resolve({ userId: options.user.id });
  },

  invalidate(data) {
    return Ember.RSVP.resolve();
  }
});
