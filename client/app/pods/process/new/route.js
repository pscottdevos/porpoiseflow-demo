import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    var processDef;
    return this.store.find('porpoiseflow/processDef', params.process_def_id)

    .then((tmpProcessDef) => {
      processDef = tmpProcessDef;
      return this.store.find('auth/user', params.user_id);
    })

    .then((user) => this.store.createRecord('porpoiseflow/process', {
        owner: user,
        processDef: processDef,
      })
    );
  },

  afterModel: function(process) {
    process.save()
    
    .then(() => this.transitionTo('process', process.get('id')));
  },
});
