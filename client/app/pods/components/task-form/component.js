import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['task'],

  actions: {
    save: function() {
      this.sendAction('save', arguments);
    }
  }

});
