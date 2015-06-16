import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/process', params.id);
  },

  render: function() {
    this._super();
    this.schedulePoll();
  },

  schedulePoll: function() {
    return Ember.run.later(this,
      function(model) {
        this.redirectToNext(model);
        this.set('timer', this.schedulePoll());
      },
      this.get('controller.model'),
      1000);
  },

  cancelPoll: function() {
    Ember.run.cancel(this.get('timer'));
  },

  /**
   * Sends us to the next Node, or to holding.
   */
  redirectToNext: function(model) {
    var process;
    return model.reload()

    .then((fetchedModel) => {
      process = fetchedModel;
      return process.get('owner');
    })

    .then((owner) => {
      var statusName = process.get('statusName');

      if (statusName === 'complete') {

        this.cancelPoll();
        process.get('subprocessOf')
        .then((node) => {
          if (node) {
            return node.get('process')

            .then((process) => this.replaceWith('process', process.get('id')));
          } else {
            return null;
          }
        });
      } else {
        
        return owner.getNextNode(process)
        .then((node) =>
        {
          if (node && node.get('subclass') === 'TaskNode') {
            this.cancelPoll()
            return this.replaceWith('node', node.get('id'));
          } else {
            return null;
          }
        });
      }
    });
  },

});
