import Ember from 'ember';

export default Ember.Controller.extend({
  showTextBox: function() {
    return this.get('model.widgetType') === 'text';
  }.property('model.widgetType'),
});
