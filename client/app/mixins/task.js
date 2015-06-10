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
  },

  doSubmit: function(){
    var process;
    var task = this.get('controller.model');
    var owner;
    task.save()

    .then(() => this.set('inProgressModel', null))

    .then(() => task.get('taskNode'))

    .then((taskNode) => taskNode.get('process'))

    .then((fetchedProcess) => {
      process = fetchedProcess;
      return process.get('owner');
    })

    .then((o) => {
      owner = o;
      return this.store.find('porpoiseflow/node',
        {next_for_actor: owner.get('id'), process: process.get('id')}
      );
    })

    .then((nodes) => {
      if (nodes.get('length')) {
        return this.transitionTo('node', nodes.objectAt(0).get('id'));
      } else {
        return this.store.find('porpoiseflow/node',
          {available_for_actor: owner.get('id'), process: process.get('id')}
        )

        .then((nodes) => {
          if (nodes.get('length')) {
            var node = nodes.objectAt(0);
            return node.assign(owner)
            .then(() => this.transitionTo('node', nodes.objectAt(0).get('id')));
          } else {
            return this.transitionTo('process', process.get('id'));
          }
        });
      }
    });
  }
});
