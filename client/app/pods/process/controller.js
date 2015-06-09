import Ember from 'ember';

export default Ember.Controller.extend({
  isComplete: function() {
    return this.get('model.statusName') === 'complete';
  }.property('model.statusName'),
});
