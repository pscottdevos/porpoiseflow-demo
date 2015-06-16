import Ember from 'ember';

import TaskMixin from '../../mixins/routes/task';

export default Ember.Route.extend(TaskMixin, {
  inProgressModel: null,

  model: function(params){
    return this.store.find('demo/choice', params.id);
  },

  actions:{
    submit: function() {
      this.doSubmit();
    }
  }
});
