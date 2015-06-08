import LoggingRoute from '../route';

export default LoggingRoute.extend({
  inProgressModel: null,

  model: function(params){
    return this.taskModel('demo/logging', params);
  },

  taskModel: function(modelName, params){
    var inProgressModel = this.get('inProgressModel');
    if (inProgressModel !== null && inProgressModel.get('id') === params.id) {
      return this.get('inProgressModel');
    }
    return this.store.find('porpoiseflow/taskNode', params.task_node_id)

    .then((taskNode) => {
      var task = this.store.createRecord(modelName, {
        taskNode: taskNode
      });
      this.set('inProgressModel', task);
      return task;
    });
  }

});
