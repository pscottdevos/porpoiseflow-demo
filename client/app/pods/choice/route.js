import Ember from 'ember';

import TaskMixin from '../../mixins/task';

export default Ember.Route.extend(TaskMixin, {
  inProgressModel: null,

  model: function(params){
    return this.store.find('demo/choice', params.id);
  },

  renderTemplate: function() {
    this.render('choice');
  },

  actions:{
    submit: function() {
      this.doSubmit();
    }
  }
});
