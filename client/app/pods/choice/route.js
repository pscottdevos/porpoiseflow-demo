import Ember from 'ember';

import TaskMixin from '../../mixins/task';

export default Ember.Route.extend(TaskMixin, {
  inProgressModel: null,

  model: function(params){
    return this.taskModel('demo/choice', params);
  },

  renderTemplate: function(controller, model) {
    this.render('choice', { controller: controller });
  },

  actions:{
    submit: function() {
      this.doSubmit();
    }
  }
});
