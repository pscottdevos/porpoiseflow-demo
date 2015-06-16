import Ember from 'ember';

export default Ember.Mixin.create({
  inProgressModel: null,

  queryParams: {
    task_node_id: { refreshModel: true }
  },

  taskModel: function(modelName, params){
    var promise;
    var inProgressModel = this.get('inProgressModel');
    if (inProgressModel !== null && inProgressModel.get('id') === params.id) {
      return this.get('inProgressModel');
    }
    if (params.task_node_id) {
      return this.store.find('porpoiseflow/taskNode', params.task_node_id)

      .then((taskNode) => {
        var task = this.store.createRecord(modelName, {
          taskNode: taskNode
        });
        this.set('inProgressModel', task);
        return task;
      });
    } else {
      return this.store.find(modelName, params.id)
      .then((task) => {
        this.set('inProgressModel', task);
        return task;
      });
    }
  },

  doSubmit: function(){
    var process;
    var taskNode;
    var task = this.get('controller.model');

    return task.save()
    .catch((error) => {
      var msg = 'Your task was not saved because of the following:\n\n' +
        error.message + '\n\nAn attempt will be made to continue.';
      return window.alert(msg);
    })
    .then(() => this.set('inProgressModel', null))
    .then(() => task.get('taskNode'))
    .then((fetchedTaskNode) => 
    {
      taskNode = fetchedTaskNode;
      return taskNode.get('process');
    })
    .then((fetchedProcess) =>
    {
      process = fetchedProcess;
      return taskNode.get('actor');
    })
    .then((actor) => actor.getNextNode(process))
    .then((node) =>
    {
      if (node) {
        return this.transitionTo('node', node.get('id'));
      } else {
        return this.transitionTo('process', process.get('id'));
      }
    });

  }
});