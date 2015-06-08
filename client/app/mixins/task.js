import Ember from 'ember';

export default Ember.Mixin.create({
  inProgressModel: null,

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
