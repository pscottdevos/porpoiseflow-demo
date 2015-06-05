import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/process', params.id);
  },

  afterModel: function(model) {
    return model.reload()

    .then((process) => {
      var statusName = process.get('statusName');

      if (statusName !== 'complete') {
        
        return this.store.find('porpoiseflow/node', 
          {next_for_actor: process.get('owner.id')})

        .then((nodes) => {
          if (nodes.get('length')) {
            return this.transitionTo('node', nodes.objectAt(0).get('id'));
          } else {
            return this.transitionTo('holding');
          }
        });
      }
    });
  }

});
