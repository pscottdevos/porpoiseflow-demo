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

  render: function() {
    this._super();
    Ember.run.later(this, this.persistAndRedirect, this.get('controller.model'),
      1000);
  },

  /**
   * Save the new process and redirect to it.
   */
  persistAndRedirect: function(process) {
    process.save()
    
    .then(() => this.replaceWith('process', process.get('id')));
  },
});
