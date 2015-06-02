import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/node', params.id);
  },

  afterModel: function(node) {
    if (node.get('subclass') === 'Gateway') {
      return this.transitionTo('holding');
    } else if (node.get('subclass') === 'TaskNode') {
      var taskNode;
      return this.store.find('porpoiseflow/taskNode', node.get('id'))

      .then((tmpTaskNode) => {
        taskNode = tmpTaskNode;
        var taskClass = taskNode.get('taskClass');
        var routeName = Ember.String.dasherize(taskClass);
        this.store.find('porpoiseflow/task', {task_node:taskNode.get('id')})
        
        .then((tasks) => {
          if (tasks.get('length')) {
            return this.transitionTo(routeName, tasks.objectAt(0).get('id'));
          } else {
            return this.transitionTo(routeName + '/new', {queryParams: {'task_node_id': taskNode.get('id')}});
          }
        });
      });
    }
  },

});
