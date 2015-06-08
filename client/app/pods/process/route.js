import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/process', params.id);
  },

  render: function() {
    this._super();
    Ember.run.later(this, this.redirectToNext, this.get('controller.model'),
      1000);
  },

  /**
   * Sends us to the next Node, or to holding.
   */
  redirectToNext: function(node) {
    return node.reload()

    .then((process) => {
      var statusName = process.get('statusName');

      if (statusName !== 'complete') {
        
        return this.store.find('porpoiseflow/node', 
          {next_for_actor: process.get('owner.id'), process: process.get('id')}
        )

        .then((nodes) => {
          if (nodes.get('length')) {
            return this.replaceWith('node', nodes.objectAt(0).get('id'));
          } else {
            return this.replaceWith('holding');
          }
        });
      }
    });
  }

});
