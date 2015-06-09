import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    if (params.process_id) {
      return this.store.find('porpoiseflow/process', params.process_id);
    }

    return null;
  }
});
