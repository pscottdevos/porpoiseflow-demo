import LoggingRoute from '../route';

export default LoggingRoute.extend({

  model: function(params){
    return this.taskModel('demo/logging', params);
  },

  setNodeDefProperties: function(model, properties) {
    if (properties.get('widgetType')) {
      model.set('widgetType', properties.get('widgetType.value'));
    }
  },

  renderTemplate: function(controller, model) {
    this.render('logging', { controller: controller });
  },

});
