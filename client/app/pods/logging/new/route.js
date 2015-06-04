import LoggingRoute from '../route';

export default LoggingRoute.extend({
  inProgressModel: null,

  model: function(params){
    if (this.get('inProgressModel') !== null){
      return this.get('inProgressModel');
    }
    return this.store.find('porpoiseflow/taskNode', params.task_node_id)

    .then((taskNode) =>
      this.store.createRecord('demo/logging', {
        taskNode: taskNode
      })
    );
  }
});
