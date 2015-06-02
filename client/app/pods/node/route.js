import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('porpoiseflow/node', params.id);
  },

  afterModel: function(node) {
    if (node.get('subclass') === 'Gateway') {
      return this.transitionTo('holding');
    } else if (node.get('subclass') === 'Task') {
      return this.store.find('porpoiseflow/taskNode', node.get('id'))

      .then((taskNode) => {
        var taskClass = taskNode.get('TaskClass');
        var routeName = Ember.string.dasherize(taskClass);
        this.store.find('porpoiseflow/task', {task_node:taskNode.get('id')})

        .then((tasks) => {
          if (tasks.get('length')) {
            return this.transitionTo(routeName, tasks.objectAt(0).get('id'));
          } else {
            return this.transitionTo(routeName + '/new');
          }
        });
      });
    }
  },

});
