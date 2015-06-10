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
      var choices = this.get('controller.model').get('choices');
      var validChoices = ['A', 'B', 'A B', 'B A', 'C', 'D', 'C D', 'D C'];
      if (validChoices.indexOf(choices) === -1) {
        Ember.$('#errorLabel').text('Invalid Choice');
      } else {
        Ember.$('#errorLabel').text('');
        this.doSubmit();
      }
    }
  }
});
