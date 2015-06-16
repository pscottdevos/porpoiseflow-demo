import Ember from 'ember';

export default Ember.Controller.extend({
  isComplete: function() {
    return this.get('model.statusName') === 'complete';
  }.property('model.statusName'),

  hasWaitingTask: function() {
    if (this.get('isComplete')) {
      return false;
    }
    var process = this.get('model');
    return process.get('owner')
    .then((owner) => owner.getNextNode(process))
    .then((node) => {
      if (node.get('subclass') !== 'ParallelGateway' ||
          node.get('subclass') !== 'InclusiveGateway') {
        return true;
      } else {
        return false;
      }
    });
  }.property('model', 'model.owner')
});
