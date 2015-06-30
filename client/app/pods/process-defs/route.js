import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('porpoiseflow/processDef')
    .then((processDefs) => {
      processDefs.set('sortProperties', ['name']);
      processDefs.set('sortAscending', true);
      return processDefs;
    });
  }
});
