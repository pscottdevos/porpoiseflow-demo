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

        //Why is this a promise?
        process.get('subprocessOf')
        .then((node) => {
          if (node) {
            //while this is not?
            this.replaceWith('process', node.get('process.id'));
          }
        });
      } else {
        
        return this.store.find('porpoiseflow/node', 
          {next_for_actor: owner.get('id'), process: process.get('id')}
        )

        .then((nodes) => {
          if (nodes.get('length')) {
            return this.replaceWith('node', nodes.objectAt(0).get('id'));
          } else {
            return this.store.find('porpoiseflow/node',
              {available_for_actor: owner.get('id'), process: process.get('id')}
            )

            .then((nodes) => {
              if (nodes.get('length')) {
                var node = nodes.objectAt(0);
                return node.assign(owner)
                .then(() => this.transitionTo('node', node.get('id')));
              } else {
                return this.replaceWith('holding');
              }
            });
          }
        });
      }
    });
  }

});
