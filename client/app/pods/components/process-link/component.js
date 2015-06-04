import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Component.extend({

  process: function() {
    var user = this.get('user');
    var processDef = this.get('processDef');
    return DS.PromiseObject.create( { promise: 
      processDef.store.find('porpoiseflow/process', {
        process_def: processDef.get('id'),
        owner_id: user.get('id'),
        status__name: 'active',
        active: true,
      })
    
      .then((processes) => {
        if (processes.get('length')) { return processes.objectAt(0); }
        else { return null; }
      })
    });
  }.property('processDef','user'),

});
