import ChoiceRoute from '../route';

export default ChoiceRoute.extend({
  inProgressModel: null,

  model: function(params){
    return this.taskModel('demo/choice', params);
  },

  renderTemplate: function(controller, model) {
    this.render('choice', { controller: controller });
  },

});
