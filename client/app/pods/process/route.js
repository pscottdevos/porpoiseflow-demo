import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/process', params.id);
  },

  render: function() {
    this._super();

    if (!this.get('controller.model.isComplete')) {
      this.schedulePoll();
    }
  },

  schedulePoll: function() {
    return Ember.run.later(this,
      function(model) {
        return model.reload().then((reloadedModel) =>
          this.transitionOrHold(reloadedModel));
      },
      this.get('controller.model'),
      1000);
  },

  cancelPoll: function() {
    Ember.run.cancel(this.get('timer'));
  },

  /**
   * Sends us to the next Node, if we have one and the process is incomplete.
   */
  transitionOrHold: function(model) {
    if (model.get('isComplete')) {
      return this.handleProcessComplete(model);
    }
    
    return this.continueProcess(model);
  },

  /**
   * If our process is a subprocess of another node, transition to that node.
   * Otherwise, do nothing.
   */
  handleProcessComplete: function(process) {
    return process.get('subprocessOf')
    .then((node) => {
      if (node) {
        return node.get('process')

        .then((process) => this.replaceWith('process', process.get('id')));
      } else {
        return null;
      }
    });
  },

  /**
   * Check for another node in our process. If we find one, transition to it.
   * Otherwise, schedule another poll.
   */
  continueProcess: function(process) {
    return process.get('owner')

    .then((owner) => {
      return owner.getNextNode(process)
      .then((node) =>
      {
        if (node && node.get('subclass') === 'TaskNode') {
          //there probably won't actually be a running poll at this point, but
          //just in case
          this.cancelPoll();
          return this.replaceWith('node', node.get('id'));
        } else {
          this.set('timer', this.schedulePoll());
          return null;
        }
      });
    });
  },

});
