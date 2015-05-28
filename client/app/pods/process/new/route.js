import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    console.log('user_id:' + params.user_id);
    console.log('process_def_id:' + params.process_def_id);
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
