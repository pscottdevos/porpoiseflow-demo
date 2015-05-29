import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/processDef', params.process_def_id)

    .then((processDef) =>
      this.store.createRecord('porpoiseflow/process', {
        owner: params.user_id,
        processDef: processDef,
      })
    );
  },

  afterModel: function(process) {
    process.save()
    
    .then(() => this.transitionTo('process', process.get('id')));
  },
});
