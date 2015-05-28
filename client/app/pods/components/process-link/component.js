import Ember from 'ember';

export default Ember.Component.extend({

  process: function() {
    var processDef = this.get('processDef')
    return processDef.store.find('porpoiseflow/process', {
      process_def_id: processDef.get('id'),
      owner: this.get('user.id'),
      active: true,
    });
  }.property('processDef','user'),

  routeName: function() {
    if (!this.get('process.id')) {
      return '/processes/new';
    } else {
      return '/processes/' + this.get('process.id');
    }
  }.property('process')
});
