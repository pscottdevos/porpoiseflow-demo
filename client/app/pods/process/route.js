import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/process', params.id);
  },

  afterModel: function(process) {
    return this.store.find('porpoiseflow/node', 
      {next_for_actor: process.get('owner')})

    .then((nodes) => {
      if (nodes.get('length')) {
        return this.transitionTo('node', nodes.objectAt(0).get('id'));
      } else {
        return this.transitionTo('holding');
      }
    });
  },
});
