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
      return (node.get('subclass') !== 'ParallelGateway' ||
          node.get('subclass') !== 'InclusiveGateway');
    });
  }.property('model', 'model.owner')
});
