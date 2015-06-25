import ChoiceRoute from '../route';

export default ChoiceRoute.extend({
  inProgressModel: null,

  model: function(params){
    return this.taskModel('demo/choice', params);
  },

  setNodeDefProperties: function(model, properties) {
    if (properties.get('widgetType')) {
      model.set('widgetType', properties.get('widgetType.value'));
    }
  },

  renderTemplate: function(controller, model) {
    this.render('choice', { controller: controller });
  },

});
