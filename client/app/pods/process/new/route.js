import Ember from 'ember';

import config from 'client/config/environment';

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

  afterModel: function(model, transition) {
    if (!config.APP.USE_ANIMATIONS) {
      return this.persistAndRedirect(model);
    }
  },

  render: function() {
    this._super();

    if(config.APP.USE_ANIMATIONS) {
       Ember.run.later(
        this, this.persistAndRedirect, this.get('controller.model'),
        1000); 
    }

  },

  /**
   * Save the new process and redirect to it.
   */
  persistAndRedirect: function(process) {
    return process.save()
    
    .then(() => this.replaceWith('process', process.get('id')));
  },
});
