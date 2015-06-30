import Ember from 'ember';

export default Ember.Controller.extend({
  hasWaitingTask: false,

  isComplete: function() {
    return this.get('model.statusName') === 'complete';
  }.property('model.statusName'),

  hasWaitingTaskObserver: function() {
    if (this.get('isComplete')) {
      return this.set('hasWaitingTask', false);
    }
    var process = this.get('model');
    process.get('owner')
    .then((owner) => owner.getNextNode(process))
    .then((node) => {
      this.set('hasWaitingTask',
        node === null ||
        node.get('subclass') !== 'ParallelGateway' ||
        node.get('subclass') !== 'InclusiveGateway');
    });
  }.observes('model', 'model.owner')
});
