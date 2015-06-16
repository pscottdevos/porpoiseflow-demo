import LoggingRoute from '../route';

export default LoggingRoute.extend({

  model: function(params){
    return this.taskModel('demo/logging', params);
  },

  renderTemplate: function(controller, model) {
    this.render('logging', { controller: controller });
  },

});
